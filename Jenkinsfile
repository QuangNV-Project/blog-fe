pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "blog-fe"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                dir('blog-fe') {
                    sh 'npm ci'
                }
            }
        }

        stage('Lint') {
            steps {
                dir('blog-fe') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Type Check') {
            steps {
                dir('blog-fe') {
                    sh 'npm run type-check'
                }
            }
        }

        stage('Build') {
            steps {
                dir('blog-fe') {
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                dir('blog-fe') {
                    sh """
                        docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                        docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying application...'
                // Add your deployment steps here
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}

