docker login

cd ./backend
docker build -t tchojnacki2001/cloudp2-backend-prod .
docker push tchojnacki2001/cloudp2-backend-prod

cd ../frontend
docker build -t tchojnacki2001/cloudp2-frontend-prod .
docker push tchojnacki2001/cloudp2-frontend-prod
