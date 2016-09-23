#### Dockerfile for Newebe

This version of the Dockerfile assumes that you deployed CouchDB in another
container and that SSL is managed by a reverse Proxy. This container follows
the Docker principle of having one process for each container.

#### Configuration

Volume for configuration files must be managed manually through docker-compose
or equivalent.

```
    volumes:
            - /your/target/file/config.yaml:/usr/local/etc/newebe/config.yaml
```

