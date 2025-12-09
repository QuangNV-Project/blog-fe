pipeline {
    agent any

    environment {
        // ================= CẤU HÌNH CHUNG =================
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_IMAGE = 'quangnv1911/blog-fe'
        BUILD_OUTPUT_DIR = 'dist'
        
        // [NEW] Đường dẫn thư mục lưu cache trên máy chủ Jenkins (Host)
        // Bạn có thể đổi đường dẫn này tùy ý
        HOST_NPM_CACHE_DIR = '/home/quangnv_dev/npm/jenkins-npm-cache'
        
        // [UPDATE] Dùng bản 22-alpine (LTS) để ổn định nhất
        NODE_IMAGE = 'node:22-alpine'
        
        // Dynamic variables
        IMAGE_TAG = ''
        BRANCH_NAME = "${env.GIT_BRANCH.replaceFirst(/^origin\//, '')}"
        SHOULD_DEPLOY = 'false'

        // Job data
        JOB_NAME = "${env.JOB_NAME}"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
        // ==================================================
    }

    stages {
        // ================================================
        // 1️⃣ SETUP & DETERMINE ENVIRONMENT
        // ================================================
        stage('Setup Environment') {
            steps {
                script {
                    echo "Current branch: ${BRANCH_NAME}"

                    if (BRANCH_NAME == 'main') {
                        IMAGE_TAG = 'prod'
                        SHOULD_DEPLOY = 'true'
                    } else if (BRANCH_NAME == 'dev') {
                        IMAGE_TAG = 'dev'
                        SHOULD_DEPLOY = 'true'
                    } else {
                        // Các branch feature/fix sẽ dùng build number làm tag để test
                        IMAGE_TAG = "build-${BUILD_NUMBER}"
                    }

                    env.IMAGE_TAG = IMAGE_TAG
                    env.SHOULD_DEPLOY = SHOULD_DEPLOY

                    echo "✅ Branch: ${BRANCH_NAME}"
                    echo "✅ Image Tag: ${IMAGE_TAG}"
                    echo "✅ Should Deploy: ${SHOULD_DEPLOY}"
                }
            }
        }

        // ================================================
        // 2️⃣ INSTALL DEPENDENCIES & BUILD APPLICATION
        // ================================================
        stage('Install & Build App') {
            steps {
                script {
                    // Chạy build trong Docker container với npm cache từ Host
                    docker.image(NODE_IMAGE).inside("-u 0:0 -v ${HOST_NPM_CACHE_DIR}:/.npm") {
                        
                        echo "🔨 Installing Dependencies (With Cache)..."
                        sh 'npm ci'
                        
                        echo "📝 Running Lint..."
                        sh 'npm run lint || true'

                        echo "🔍 Running Type Check..."
                        sh 'npm run type-check'

                        echo "🔨 Building Next.js Application..."
                        sh 'npm run build'

                        // [QUAN TRỌNG] Trả lại quyền sở hữu thư mục build cho user jenkins (UID 1000)
                        // Nếu không có bước này, bước docker build phía sau sẽ lỗi Permission Denied
                        sh 'chown -R 1000:1000 .next'
                        sh 'chown -R 1000:1000 node_modules || true'
                    }
                }
            }
        }

        // ================================================
        // 3️⃣ BUILD & PUSH DOCKER IMAGE
        // ================================================
        stage('Build Docker Image') {
            when {
                expression { SHOULD_DEPLOY == 'true' }
            }
            steps {
                script {
                    echo "🐳 Building Docker image..."

                    // Pull cache cũ để build nhanh hơn
                    sh """
                        docker pull ${DOCKERHUB_IMAGE}:${IMAGE_TAG} || true
                        docker pull ${DOCKERHUB_IMAGE}:latest || true
                    """

                    // Build Docker image
                    sh """
                        docker build \
                            --cache-from ${DOCKERHUB_IMAGE}:${IMAGE_TAG} \
                            --cache-from ${DOCKERHUB_IMAGE}:latest \
                            -t ${DOCKERHUB_IMAGE}:${IMAGE_TAG} .
                    """
                    echo "✅ Docker image built successfully"
                }
            }
        }

        stage('Push Docker Image') {
            when {
                expression { SHOULD_DEPLOY == 'true' }
            }
            steps {
                script {
                    echo "⬆️ Pushing Docker image to Docker Hub..."
                    
                    // Login Docker Hub
                    sh """
                        echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                    """

                    // Push image
                    sh "docker push ${DOCKERHUB_IMAGE}:${IMAGE_TAG}"
                    
                    echo "✅ Docker image pushed successfully"
                }
            }
        }

        // ================================================
        // 4️⃣ DEPLOY TO SERVERS
        // ================================================
        
        // --- DEPLOY DEV ---
        stage('Deploy to DEV Server') {
            when {
                expression { BRANCH_NAME == 'dev' }
            }
            steps {
                script {
                    echo "🚀 Deploying to DEV Server..."
                    withCredentials([
                        string(credentialsId: 'remote-server-dev-host', variable: 'REMOTE_HOST'),
                        string(credentialsId: 'remote-server-dev-user', variable: 'REMOTE_USER'),
                        string(credentialsId: 'remote-server-dev-port', variable: 'REMOTE_PORT'),
                        sshUserPrivateKey(credentialsId: 'remote-ssh-key-dev', keyFileVariable: 'SSH_KEY')
                    ]) {
                        // 1. Pull image
                        sh """
                            ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} '
                                docker pull ${DOCKERHUB_IMAGE}:${IMAGE_TAG}
                            '
                        """
                        
                        // 2. Stop & Remove Old Container
                        sh """
                            ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} '
                                docker stop blog-fe || true
                                docker rm blog-fe || true
                            '
                        """

                        // 3. Run New Container
                        sh """
                            ssh -o StrictHostKeyChecking=no -i $SSH_KEY -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST '
                                ENV_FILE=".env.dev"
                                PORT_VAR="BLOG_PORT" 
                                source ./infra/\${ENV_FILE}
                                eval "PORT=\\\$\${PORT_VAR}"

                                echo "Running Blog FE on DEV -> Port: \$PORT"
                                docker run -d --name blog-fe \
                                --env-file ./infra/\$ENV_FILE \
                                -p \$PORT:3000 \
                                --restart unless-stopped \
                                ${DOCKERHUB_IMAGE}:${IMAGE_TAG}
                            '
                        """
                    }
                }
            }
        }

        // --- DEPLOY PROD ---
        stage('Deploy to PROD Server') {
            when {
                expression { BRANCH_NAME == 'main' }
            }
            steps {
                script {
                    echo "🚀 Deploying to PROD Server..."
                    withCredentials([
                        string(credentialsId: 'remote-server-prod-host', variable: 'REMOTE_HOST'),
                        string(credentialsId: 'remote-server-prod-user', variable: 'REMOTE_USER'),
                        string(credentialsId: 'remote-server-prod-port', variable: 'REMOTE_PORT'),
                        sshUserPrivateKey(credentialsId: 'remote-ssh-key-prod', keyFileVariable: 'SSH_KEY')
                    ]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} '
                                docker pull ${DOCKERHUB_IMAGE}:${IMAGE_TAG}
                            '
                        """
                        
                        sh """
                            ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} -p ${REMOTE_PORT} ${REMOTE_USER}@${REMOTE_HOST} '
                                docker stop blog-fe || true
                                docker rm blog-fe || true
                            '
                        """

                        sh """
                            ssh -o StrictHostKeyChecking=no -i $SSH_KEY -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST '
                                ENV_FILE=".env.prod"
                                PORT_VAR="BLOG_PORT"
                                source ./infra/\${ENV_FILE}
                                eval "PORT=\\\$\${PORT_VAR}"

                                echo "Running Blog FE on PROD -> Port: \$PORT"
                                docker run -d --name blog-fe \
                                --env-file ./infra/\$ENV_FILE \
                                -p \$PORT:3000 \
                                --restart unless-stopped \
                                ${DOCKERHUB_IMAGE}:${IMAGE_TAG}
                            '
                        """
                    }
                }
            }
        }
    }

    // ================================================
    // NOTIFICATIONS & CLEANUP
    // ================================================
    post {
        always {
            script {
                echo "✅ Pipeline execution completed"
                cleanWs()
            }
        }
        success {
            script {
                withCredentials([
                    string(credentialsId: 'telegram-bot-token', variable: 'TELEGRAM_BOT_TOKEN'),
                    string(credentialsId: 'telegram-chat-id', variable: 'TELEGRAM_CHAT_ID')
                ]) {
                    sh """
                        curl -s -X POST https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage \
                        -d chat_id=$TELEGRAM_CHAT_ID \
                        -d text="✅ Pipeline succeeded!%0AProject: blog-fe%0AJob: $JOB_NAME (#$BUILD_NUMBER)"
                    """
                }
            }
        }
        failure {
            script {
                withCredentials([
                    string(credentialsId: 'telegram-bot-token', variable: 'TELEGRAM_BOT_TOKEN'),
                    string(credentialsId: 'telegram-chat-id', variable: 'TELEGRAM_CHAT_ID')
                ]) {
                    sh """
                        curl -s -X POST https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/sendMessage \
                        -d chat_id=$TELEGRAM_CHAT_ID \
                        -d text="❌ Pipeline failed!%0AProject: blog-fe%0AJob: $JOB_NAME (#$BUILD_NUMBER)"
                    """
                }
            }
        }
        cleanup {
            script {
                sh 'docker logout || true'
            }
        }
    }
}