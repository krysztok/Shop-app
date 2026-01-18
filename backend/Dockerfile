FROM openjdk:27-ea-oraclelinux9
ARG JAR_FILE=backend/jar/*.jar
COPY ${JAR_FILE} app.jar
COPY /backend/cImages /cImages 
COPY /backend/images /images 
ENTRYPOINT ["java","-jar","/app.jar"]