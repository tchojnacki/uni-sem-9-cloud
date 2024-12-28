docker login

cd ./backend
docker build -f ./Dockerfile.prod -t tchojnacki2001/cloudp2-backend-prod .
docker push tchojnacki2001/cloudp2-backend-prod

cd ../frontend
docker build -f ./Dockerfile -t tchojnacki2001/cloudp2-frontend-prod .
docker push tchojnacki2001/cloudp2-frontend-prod
