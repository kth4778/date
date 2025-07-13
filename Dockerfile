# Use a base image with Java 21
FROM eclipse-temurin:21-jdk-jammy

# Set the working directory in the container
WORKDIR /app

# Copy the Gradle wrapper files
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Copy the source code
COPY src src

# Grant execution rights to the Gradle wrapper
RUN chmod +x gradlew

# Build the Spring Boot application
# This will create the JAR file in build/libs
RUN ./gradlew bootJar

# Expose the port your Spring Boot application runs on (default is 8080)
EXPOSE 8080

# Run the Spring Boot application
# The JAR file name might vary based on your build.gradle version
# Replace 'backend-0.0.1-SNAPSHOT.jar' with your actual JAR file name if different
ENTRYPOINT ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]
