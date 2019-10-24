#!/bin/bash

docker rm ubuntu_node-server_1 --force
docker pull asianjohnboi/tweetery:latest 
docker run --name ubuntu_node-server_1 --restart=unless-stopped \
            --network=ubuntu_tweetery-network \
            --ip=172.18.0.2 \
            -p 5000:5000 asianjohnboi/tweetery:latest 