pipeline {

    agent any

    environment {
        IMAGE_NAME = "chan0305/shooting-game"
        CONTAINER_NAME = "shooting-game"
        PORT = "5000"
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    stages {

        stage('Checkout') {
            steps {
                echo "Checking out source code..."
                checkout scm
            }
        }

        stage('Build Information') {
            steps {
                sh '''
                echo "Build Number : ${BUILD_NUMBER}"
                echo "Branch       : ${BRANCH_NAME}"
                echo "Workspace    : ${WORKSPACE}"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t shooting-game:latest .
                '''
            }
        }

        stage('Docker Hub Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh '''
                    echo "$DOCKER_PASS" | docker login \
                    -u "$DOCKER_USER" \
                    --password-stdin
                    '''
                }
            }
        }

        stage('Tag Docker Image') {
            steps {
                sh '''
                docker tag shooting-game:latest ${IMAGE_NAME}:${BUILD_NUMBER}

                docker tag shooting-game:latest ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Push Docker Image') {
            steps {
                sh '''
                docker push ${IMAGE_NAME}:${BUILD_NUMBER}

                docker push ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                docker rm -f ${CONTAINER_NAME} || true
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                docker run -d \
                    --name ${CONTAINER_NAME} \
                    -p ${PORT}:5000 \
                    ${IMAGE_NAME}:latest
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                echo "Waiting for application..."

                sleep 15

                docker ps

                docker logs ${CONTAINER_NAME}
                '''
            }
        }

    }

    post {

        success {

            echo "==================================="

            echo "BUILD SUCCESS"

            echo "Application URL: http://localhost:5000"

            echo "Docker Image: ${IMAGE_NAME}:latest"

            echo "==================================="

        }

        failure {

            echo "==================================="

            echo "BUILD FAILED"

            echo "Check Jenkins Console Output"

            echo "==================================="

        }

        always {

            sh '''
            docker image prune -f || true
            '''

            echo "Pipeline Finished"

        }

    }

}
