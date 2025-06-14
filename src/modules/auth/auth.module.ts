import { AuthMethod, config } from '@/common/config';
import { OAuthModule } from '@/modules/auth/oauth/oauth.module';
import { Module } from '@nestjs/common';
import { ApikeyModule } from './apikey/apikey.module';
import { OidcModule } from './oidc/oidc.module';
import { PasswordModule } from './password/password.module';
import { PhoneModule } from './phone/phone.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';

const imports: Array<any> = [TeamsModule, UsersModule, ApikeyModule];
if (config.auth.enabled.includes(AuthMethod.oidc)) {
  imports.push(OidcModule);
}
if (config.auth.enabled.includes(AuthMethod.password)) {
  imports.push(PasswordModule);
}
if (config.auth.enabled.includes(AuthMethod.phone)) {
  imports.push(PhoneModule);
}

if (config.auth.enabled.some((method) => method.startsWith('oauth-'))) {
  imports.push(OAuthModule);
}

@Module({
  controllers: [],
  providers: [],
  imports,
  exports: imports,
})
export class AuthModule {}
