#!/bin/bash

# Create a Kubernetes secret
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=randomkey

# Deploy the Ingress controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

# Install Strimzi in the default namespace
kubectl create -f 'https://strimzi.io/install/latest?namespace=default'

# Deploy Kafka using Strimzi
kubectl apply -f https://strimzi.io/examples/latest/kafka/kafka-persistent-single.yaml -n default

# Wait for the Kafka cluster to be ready
kubectl wait kafka/my-cluster --for=condition=Ready --timeout=300s -n default
