
pipeline 
{
    
    agent 
    {
        node 
        {
            label 'ubuntu-dev'
        }
    }

    environment
    {
        name_container  = 'api_authentication_cipher'
        name_image      = 'api-authentication-cipher'
        port_expose     = 8001
        port            = 3000
        config          = '/microservicios/config/'
    }
    
    stages
    {
        stage('Build-Image')
        {
            steps 
            {
                echo 'Inicio' 
                sh 'docker build -t ${name_image} .'
                echo 'Remover contenedor'
                sh 'docker rm -f ${name_container}'
                echo 'Levantar contenedor'
                sh '''docker run --restart=always --name ${name_container} \
                      --env-file /microservicios/sql/.env \
                      -v ${config}authenticationCipher.json:/dist/json/configuracion.json \
                      -v ${config}rabbit.json:/dist/json/rabbit.json \
                      -v ${config}redis.json:/dist/json/redis.json \
                      -dp ${port_expose}:${port} ${name_image}'''
                echo 'Fin'
            }
        }
    }
}
