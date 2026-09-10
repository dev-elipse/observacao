FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

COPY . .
RUN chmod +x mvnw
RUN ./mvnw -q -DskipTests package

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "target/observacao-0.0.1-SNAPSHOT.jar"]
