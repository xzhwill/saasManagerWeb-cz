pipeline {
    options {
        buildDiscarder(logRotator(numToKeepStr: '7', artifactNumToKeepStr: '10',daysToKeepStr:'5'))
    }
    agent {label 'xiaoma_node'}

    triggers {
        pollSCM ''
    }
    parameters {
        booleanParam(name: 'reinstall', defaultValue: false, description: '是否重新安装依赖包')
    }

    environment {
        APPLICATION_NAME = "dispatch"
        APPLICATION_DISPLAY_NAME = "调度中心"
        VERSION = "1.0.0"
    }

    stages {
        stage('环境准备') {
            steps {
                dir('devops') {
                    git url: 'http://58.48.111.50:10003/ops/devops.git', poll: false
                }
                script{
                    if (env.BRANCH_NAME == "master") {
                        error("master 分支不允许构建")
                    }
                    if(env.BRANCH_NAME == 'release-testing' || env.BRANCH_NAME == 'release-changzhou'){
                        env.FINAL_APPLICATION_NAME = "${APPLICATION_NAME}"
                        env.ENV_NAME = "testing"
                    } else {
                        env.FINAL_APPLICATION_NAME = "${APPLICATION_NAME}"
                        env.ENV_NAME = "development"
                    }

                    sh "echo Build Url is ${env.BUILD_URL}"
                    sh "echo Final Application Name is : ${env.FINAL_APPLICATION_NAME}"
                    sh "echo Env Name is : ${env.ENV_NAME}"

                }
            }
         }

         stage('安装依赖') {
            when {
                expression {
                    params.reinstall == true
                }
            }
            steps {
                sh "cnpm install"
            }
         }

         stage('构建') {
            steps {
                script{
                    sh "npm run build"
                }
            }
         }

        stage('写入版本号') {
            steps {
                sh "echo APPLICATION_NAME is : ${env.FINAL_APPLICATION_NAME}"
                sh 'touch dist/version.txt'
                sh 'echo $VERSION > dist/version.txt'
            }
        }

        stage('出包') {
            steps {
                sh "rm -rf dist/*.zip"
                sh "cd dist && zip -r  ${env.FINAL_APPLICATION_NAME}_${VERSION}.zip ."
            }
        }
        stage('归档') {
            steps {
                sh 'mkdir -p /home/xiaoma/data/artifacts/changzhou/$APPLICATION_NAME'
                sh "cp dist/${env.FINAL_APPLICATION_NAME}_${VERSION}.zip /home/xiaoma/data/artifacts/changzhou/${APPLICATION_NAME}/${env.FINAL_APPLICATION_NAME}_${VERSION}.zip"
            }
        }

        stage('发布到DEV|QA') {
            steps {
                ansiblePlaybook(
                    inventory: "devops/provision/inventories/${env.ENV_NAME}/hosts",
                    playbook: 'devops/provision/deploy_web.yml',
                    limit: "changzhou",
                    tags: 'web_application',
                    extraVars: [
                        application_name: "${env.FINAL_APPLICATION_NAME}",
                        application_version: '$VERSION',
                        application_package_path: "${WORKSPACE}/dist/${env.FINAL_APPLICATION_NAME}_${VERSION}.zip",
                        application_package_name: "${env.FINAL_APPLICATION_NAME}_${VERSION}.zip",
                        apps_directory: "/home/xiaoma/data/changzhou"
                    ])
            }
        }
    }
}
