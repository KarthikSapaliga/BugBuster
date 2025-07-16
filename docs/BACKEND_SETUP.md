# BugBuster (Backend)

---

## 🟦 Step 1: Install Maven and Set Environment Variables

1. **Install Maven**
   Download and install Apache Maven from the [official website](https://maven.apache.org/download.cgi).

    - Download the binary zip archive (e.g., apache-maven-3.9.11-bin.zip).
    - Extract it to a folder, such as: `C:\apache-maven-3.9.11`

2. **Ensure Java 24 is Installed**
   Your project requires **Java 24**. Download it from [Oracle](https://www.oracle.com/java/technologies/javase/jdk24-archive-downloads.html) or use a trusted OpenJDK provider.

3. **Set Environment Variables**

    1. Add **JAVA_HOME**:

        - New under System Variables
        - Variable name: `JAVA_HOME`
        - Variable value: path to your JDK (e.g., `C:\Program Files\Java\jdk-24`)

    2. Add **MAVEN_HOME**:

        - Variable name: MAVEN_HOME
        - Variable value: path to your Maven installation (e.g., `C:\apache-maven-3.9.11`)

    3. Update **PATH**: Find the Path variable under System Variables, click Edit and Add:
        - `%JAVA_HOME%\bin`
        - `%MAVEN_HOME%\bin`

4. Verify installation

```bash
java -version
mvn -version
```

---

## 🟦 Step 2: Install Required VS Code Extensions

In **VS Code**, go to the **Extensions** panel (`Ctrl+Shift+X`) and install the following:

| Extension                         | Publisher | Purpose                              |
| --------------------------------- | --------- | ------------------------------------ |
| ✅ Community Server Connectors    | Red Hat   | Replaces “Tomcat for Java” extension |
| ✅ Java Extension Pack            | Microsoft | Core Java support                    |
| ✅ Maven for Java                 | Microsoft | Maven project support                |
| ✅ Debugger for Java _(optional)_ | Microsoft | Java debugging support               |

---

## 🟦 Step 3: Add Tomcat to Community Server Connectors

1. Right click on `Community Server Connector` on Server Panel
2. Click **+ Create new Server** → Slect `Yes` for Download Server? → Select **Apache Tomcat** → Choose version `9.0.30`.

🔗 Follow the guide here for help:
[VS Code Tomcat Integration](https://code.visualstudio.com/docs/java/java-tomcat-jetty)

---

## 🟦 Step 4: Build the Project

1. Open a terminal in VS Code.
2. Run the following Maven command:

    ```bash
    mvn clean package
    ```

✅ This will generate a `.war` file inside the `target/` directory.

---

## 🟦 Step 5: Deploy WAR to Tomcat

1. Locate the file: `target/bugbuster.war`
2. Right-click the `.war` file → Select **Run on Server**
3. The application will be deployed and accessible at:

    ```
    http://localhost:8080/bugbuster/
    ```

---

## 🟦 Step 6: Test Your Servlet

Example servlet:

```java
@WebServlet("/api/test")
public class TestServlet extends HttpServlet {
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException {
        res.setContentType("text/plain");
        res.getWriter().println("Servlet working!");
    }
}
```

### 📁 Suggested Folder Structure

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── bugbuster/
│   │           └── servlets/
│   │               ├── DBUtil.java
│   │               └── TestServlet.java
```

### 🌐 Access URL

```
http://localhost:8080/bugbuster/api/test
```

---
