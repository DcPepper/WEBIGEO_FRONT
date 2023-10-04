pipeline {
    agent {
        label 'Front_End'
    }
    environment {
        DOCKER_ID = "webigeo"
        DOCKER_IMAGE = "my-react"
        DOCKER_TAG = "pre"
        DOCKER_FRONT = "Front_Container"
    }
    stages {

        stage("Clean the containers"){
            steps{
                script{
                    def container = sh(script: 'docker ps',returnStdout: true).trim()

                    echo "This is the output : ${container}"

                    if (container.contains(env.DOCKER_FRONT)){
                        sh "docker stop $DOCKER_FRONT"
                        sh "docker rm $DOCKER_FRONT"
                        sh "docker rmi $DOCKER_IMAGE:$DOCKER_TAG || true"
                    }
                    else{
                        echo "The container is clean"
                    }
                }
            }
        }

        stage("Front End image") {
            steps {
                script {
                    //sh "docker stop $DOCKER_FRONT"
                    //sh "docker rm $DOCKER_FRONT"
                    echo "Building Docker image: $DOCKER_IMAGE:$DOCKER_TAG"
                    sh "docker build -t $DOCKER_ID/$DOCKER_IMAGE:$DOCKER_TAG -f Dockerfile . --no-cache"
                }
            }
        }

        stage("Docker run the image") {
            steps {
                script {
                    echo "Running Docker container: $DOCKER_FRONT"
                    sh "docker run -d -p 3020:3000 --name $DOCKER_FRONT $DOCKER_ID/$DOCKER_IMAGE:$DOCKER_TAG"
                    sh "docker ps"
                }
            }
        }

        
        stage("Testing the containers") {
            steps {
                script {
                    def serveripaddress = "4.236.153.248"
                    def containerId = sh(script: "docker ps -qf name=$DOCKER_FRONT", returnStdout: true).trim()
                


                    def url = "http://${serveripaddress}:3020"

                    echo "Testing application at $url"
                    
                    // Use 'timeout' to prevent 'curl' from running indefinitely
                    def response = sh(script: "timeout 30 curl -i $url", returnStatus: true)
                    echo "${response}"
                    if (response != 0) {
                        error "HTTP request to $url failed, check the URL and try again."
                    } else {
                        def statusCode = sh(script: "curl -s -o /dev/null -w '%{http_code}' $url", returnStatus: true)
                        echo"This is the test case : ${statusCode}"    
                        if (statusCode == 0) {
                            echo "HTTP request to $url was successful. Status code: $statusCode"
                        } else {
                            error "HTTP request to $url failed with status code $statusCode"
                        }
                    }
                }
            }
        }

       stage('Test the app') {
            steps {
                script {
                    // Run npm test in the Docker container and append output to result.txt
                    def result = sh(script: "docker exec -d $DOCKER_FRONT npm run test",returnStatus: true)
                    echo "print the results of : ${result}"
                    // Wait for the test to complete (adjust the sleep time as needed)
                    sleep(time: 10, unit: 'SECONDS')

                    if (result == 0) {
                        echo "Test passed"
                    } else {
                    error "The test has not passed: $result"
                    }
                }
            }
        }
        
        stage('Pushing Back End image to DockerHub') {
            environment
            {
                DOCKER_HUB_TOKEN = credentials("DOCKER_HUB_TOKEN") 
            }

            steps {

                script {
                    //env.DOCKER_HUB_TOKEN = DOCKER_HUB_TOKEN
                    sh '''
                    echo "docker login -u $DOCKER_ID -p $DOCKER_HUB_TOKEN"
                    docker login -u "webigeo" -p "yP?5Q>Ktp+YA%#_"
                    sleep 10
                    docker push $DOCKER_ID/$DOCKER_IMAGE:$DOCKER_TAG
                    '''
                }
            }
        }
        /*/    
        stage("Removing the container and Image") {
            steps {
                script {
                    echo "Stopping and removing Docker container: $DOCKER_FRONT"
                    sh "docker stop $DOCKER_FRONT"
                    sh "docker rm $DOCKER_FRONT"
                    echo "Removing Docker image: $DOCKER_IMAGE:$DOCKER_TAG"
                    sh "docker rmi $DOCKER_IMAGE:$DOCKER_TAG"
                }
            }
        }
        /*/
        stage("Invoking another pipeline") {
            steps {
                echo "Triggering another pipeline job"
                build job: 'WEBIGEO_CI_CD' //, wait: true
            }
        }
        /*/
        stage("Invoking another pipeline") {
            steps {
                script {
                    def main_pipeline = build job: 'WEBIGEO_CI_CD', parameters: [
                        booleanParam(name: 'Docker_Build_Back_End_Image', value: true),
                        booleanParam(name: 'Pushing_the_Back_End_image_to_DockerHub', value: true),
                        booleanParam(name: 'Deployment_in_webigeo', value: true)
                    ]
                    main_pipeline.waitForCompletion("Waiting for the WEBIGEO pipeline to complete")
                }
            }
        }
        /*/
        stage("End") {
            steps {
                echo "Bye"
            }
        }
    }
}
