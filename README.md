# OpenWorm Browser

Live demo: [http://browser.openworm.org](http://browser.openworm.org)

This is a C. elegans WebGL body browser coded as part of the OpenWorm project: [http://www.openworm.org/](http://www.openworm.org/)

The C. elegans model is provided by the VirtualWorm project: [http://caltech.wormbase.org/virtualworm/](http://caltech.wormbase.org/virtualworm/)

We are using the open-3d-viewer as WebGL engine (ex-Google Body Browser): [http://code.google.com/p/open-3d-viewer/](http://code.google.com/p/open-3d-viewer/)

## Projects in the Repo

| Directory | Description |
|-----------|-------------|
| `wormbrowser-appengine` | **Current** - Maven-based Google App Engine Java 17 project |
| `org.openworm.wormbrowser` | Legacy Eclipse-based App Engine project (Java 8, deprecated) |
| `org.openworm.wormbrowser.utils` | Python scripts for generating open-3d-viewer metadata |

## Prerequisites

- Java 17 JDK
- Maven 3.8+
- Google Cloud SDK with `gcloud` CLI
- Authenticated with `gcloud auth login`

### macOS Installation (Homebrew)

```bash
brew install openjdk@17 maven
export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"
```

## Local Development

```bash
cd wormbrowser-appengine

# Build the project
mvn clean package

# Run locally with Jetty (http://localhost:8080)
mvn jetty:run
```

### Local Testing Checklist

1. Open http://localhost:8080/ - WebGL 3D visualization should load
2. Open http://localhost:8080/org_openworm_wormbrowser - Should display "I write ze codez, so I am cool!"
3. Verify no console errors in browser DevTools

## Deployment to Google App Engine

### Deploy to Staging (No Traffic)

```bash
cd wormbrowser-appengine

# Deploy without routing traffic
mvn appengine:deploy -Dapp.deploy.promote=false
```

This deploys version `java17-v1` to the `wormbrowser-release` project without affecting production traffic.

### Test Staging

```bash
# Test the staging URL directly
curl https://java17-v1-dot-wormbrowser-release.appspot.com/org_openworm_wormbrowser
```

### Promote to Production

Once staging is verified:

```bash
# Route 100% of traffic to the new version
gcloud app services set-traffic default --splits=java17-v1=1 --project=wormbrowser-release
```

### Rollback (If Needed)

```bash
# List available versions
gcloud app versions list --project=wormbrowser-release

# Route traffic back to previous version
gcloud app versions migrate <previous-version> --project=wormbrowser-release
```

## Project Structure

```
wormbrowser-appengine/
├── pom.xml                              # Maven build config
├── src/main/java/org/openworm/wormbrowser/
│   └── WorkbrowserServlet.java          # Jakarta Servlet (Java 17)
├── src/main/webapp/
│   ├── WEB-INF/web.xml                  # Jakarta EE 10 web descriptor
│   ├── index.html                       # Main WebGL application
│   ├── main_ui.css
│   ├── scripts/                         # JavaScript files
│   ├── models/Virtual_Worm/             # 3D model data (~25MB)
│   └── img/
└── src/main/appengine/
    └── app.yaml                         # App Engine Java 17 runtime config
```

## Acknowledgements

- Jeff Bush for help with WebGL-loader and open3d-viewer: [http://www.coderforlife.com/](http://www.coderforlife.com/)
