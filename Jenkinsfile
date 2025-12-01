pipeline {
    agent any

    tools {
        // Đảm bảo bạn đã cấu hình NodeJS trong: Manage Jenkins -> Tools -> NodeJS
        nodejs 'node24' 
    }

    environment {
        // Docker Hub credentials
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_IMAGE = 'quangnv1911/blog-fe' // Đã cập nhật tên image

        // Dynamic variables
        IMAGE_TAG = ''
        BRANCH_NAME = "${env.GIT_BRANCH.replaceFirst(/^origin\//, '')}"
        SHOULD_DEPLOY = 'false'

        // NPM Cache config (Lưu cache vào workspace để Jenkins có thể archive)
        NPM_CONFIG_CACHE = "${env.WORKSPACE}/.npm_cache"

        // Job data
        JOB_NAME = "${env.JOB_NAME}"
        BUILD_NUMBER = "${env.BUILD_NUMBER}"
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
        // 2️⃣ RESTORE NPM CACHE
        // ================================================
        stage('Restore NPM Cache') {
            steps {
                script {
                    echo "Restoring NPM cache..."
                    try {
                        // Copy artifact từ lần build thành công trước đó để tăng tốc độ npm install
                        copyArtifacts(projectName: env.JOB_NAME, selector: lastSuccessful(), filter: '.npm_cache/**', optional: true)
                        echo "✅ NPM cache restored (if present)"
                    } catch (err) {
                        echo "No previous cache available: ${err}"
                    }
                }
            }
        }

        // ================================================
        // 3️⃣ BUILD APPLICATION (LINT, TYPE-CHECK, BUILD)
        // ================================================
        stage('Install & Build App') {
            steps {
                // Chạy trong thư mục blog-fe
                dir('blog-fe') {
                    script {
                        echo "Installing Dependencies..."
                        sh 'npm ci --prefer-offline' // Sử dụng cache nếu có

                        echo "Running Lint..."
                        sh 'npm run lint'

                        echo "Running Type Check..."
                        sh 'npm run type-check'

                        echo "Building Static Files..."
                        sh 'npm run build'
                    }
                }
            }
        }

        // ================================================
        // 4️⃣ BUILD & PUSH DOCKER IMAGE
        // ================================================
        stage('Build Docker Image') {
            when {
                expression { SHOULD_DEPLOY == 'true' }
            }
            steps {
                dir('blog-fe') { // Quan trọng: Build docker context từ thư mục source
                    script {
                        echo "Building Docker image..."

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
        }

        stage('Push Docker Image') {
            when {
                expression { SHOULD_DEPLOY == 'true' }
            }
            steps {
                script {
                    echo "Pushing Docker image to Docker Hub..."
                    
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
        // 5️⃣ SAVE CACHE
        // ================================================
        stage('Save NPM Cache') {
            steps {
                script {
                    echo "Saving NPM cache for future builds..."
                    // Lưu lại thư mục cache để dùng cho build sau
                    archiveArtifacts artifacts: '.npm_cache/**', onlyIfSuccessful: true, allowEmptyArchive: true
                }
            }
        }

        // ================================================
        // 6️⃣ DEPLOY TO SERVERS
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
                        // Lưu ý: Đổi tên biến port thành BLOG_FE_PORT để tránh trùng với backend
                        sh """
                            ssh -o StrictHostKeyChecking=no -i $SSH_KEY -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST '
                                ENV_FILE=".env.dev"
                                PORT_VAR="BLOG_FE_PORT" 
                                source ./infra/\${ENV_FILE}
                                eval "PORT=\\\$\${PORT_VAR}"

                                echo "Running Blog FE on DEV -> Port: \$PORT"

                                docker run -d --name blog-fe \
                                --env-file ./infra/\$ENV_FILE \
                                --network dev-network \
                                -p \$PORT:80 \
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
                                PORT_VAR="BLOG_FE_PORT"
                                source ./infra/\${ENV_FILE}
                                eval "PORT=\\\$\${PORT_VAR}"

                                echo "Running Blog FE on PROD -> Port: \$PORT"

                                docker run -d --name blog-fe \
                                --env-file ./infra/\$ENV_FILE \
                                --network prod-network \
                                -p \$PORT:80 \
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
                echo "Pipeline execution completed"
                cleanWs() // Dọn dẹp workspace
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