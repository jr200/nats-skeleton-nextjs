# nats-skeleton-nextjs

This is a NextJS starter application that uses:

- react 19
- nextjs 15
- next-auth v5 (with a custom-login page, see src/app/(auth)/login)
- tailwind, shadcn
- nats: client-side/browser and server-side websocket connections
- rxjs

## Installation


### Installation (helm-chart)

Add the 'jr200' public helm-charts repo:

```
helm repo add jr200 https://jr200.github.io/helm-charts/
helm repo update
```

Pull down a copy of the `values.yml`

```
helm show values jr200/nats-skeleton-nextjs > values.yml
```

Configure the following in the _values.yml_:

| Parameter                              | Description                                               | Default Value                                           |
|----------------------------------------|-----------------------------------------------------------|---------------------------------------------------------|
| `devDebug`                             | Enable or disable development debug mode.                 | `false`                                                 |
| `config.url`                           | The base URL for the application.                         | `https://chart-example.local`                           |
| `config.authIdp.issuer`                | Identity provider issuer URL.                             | `https://auth.example.com`                              |
| `config.authIdp.clientId`              | Identity provider client ID.                              | `~` (not set)                                           |
| `config.authIdp.clientSecret`          | Identity provider client secret.                          | `""` (not set)                                          |
| `config.authIdp.secret`                | Secret used for identity provider.                        | `~` (autogenerated if not specified)                    |
| `config.nats.ssl`                      | Enable SSL for NATS connection.                           | `true`                                                  |
| `config.nats.uri`                      | NATS server URI.                                          | `wss://nats.nats.svc:4222`                              |
| `config.nats.nobodyUserCreds`          | Base64-encoded credentials for nobody user in NATS.       | `""` (not set)                                          |

The `nobody` user credentials can be hardcoded in `extraEnv[0]{.name['NATS_NOBODY_CREDS_B64'], .value['...']}`, or alternatively supplied using vault and vault-actions. If the latter, also configure the following:

| Parameter                              | Description                                               | Default Value                                           |
| -------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| `vault.enabled`                        | Enable Vault integration.                                 | `false`                                                 |
| `vault.url`                            | URL of the Vault server.                                  | `https://vault.vault.svc`                               |
| `vault.authMount`                      | Vault auth mount point for Kubernetes.                    | `auth/kubernetes`                                       |
| `vault.nobodyReaderRole`               | Role in Vault for the SPA to assume.                      | `my-nats-skeleton-nextjs-role`                          |
| `vault.nobodyAccount`                  | Account for Vault's credentials.                          | `nats/creds/operator/my-op/account/my-acct/user/nobody` |
| `vault-actions.enabled`                | Enable or disable Vault actions for policy management.    | `false`                                                 |
| `vault-actions.hookConfiguration.hook` | Hook phase for Vault actions (pre-install, post-install). | `pre-install`                                           |
| `vault-actions.bootstrapToken`         | Bootstrap token for Vault actions.                        | `null`                                                  |
| `vault-actions.secretName`             | Name of the secret for Vault actions bootstrap.           | `va-bootstrap-secret`                                   |
| `vault-actions.policyName`             | Name of the created policy for Vault agent injector.      | `my-nats-skeleton-nextjs-policy`                        |


# References

- react 19: https://react.dev/blog/2024/04/25/react-19
- nextjs: https://nextjs.org/docs
- authjs v5: https://authjs.dev/reference/overview
- RxJS NATS library: https://github.com/captain-refactor/rx-nats
- RxJS Pokemon Deck Tutorial: https://www.youtube.com/watch?v=s6nG0byDI-o
