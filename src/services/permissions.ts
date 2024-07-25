import { db, eq, Role } from 'astro:db';

export enum Permissions {
  canManageUsers = 'canManageUsers',
  canManageRoles = 'canManageRoles',
  canManageMarkets = 'canManageMarkets',
  canViewContactFormLogs = 'canViewContactFormLogs',
}

export class Permission {
  private permissions: { [key: string]: boolean } = {};
  private readonly roleId: string;
  private readonly permissionsLoaded: Promise<void>;

  constructor(roleId: string) {
    this.roleId = roleId;
    this.permissionsLoaded = this.getPermissions();
  }

  private async getPermissions() {
    try {
      const role = await db
        .select()
        .from(Role)
        .where(eq(Role.id, this.roleId))
        .then((results: any[]) => results[0]);

      if (role) {
        this.permissions = {
          canManageUsers: role.canManageUsers,
          canManageRoles: role.canManageRoles,
          canManageMarkets: role.canManageMarkets,
          canViewContactFormLogs: role.canViewContactFormLogs,
        };
      }
    } catch (error) {
      console.error('Failed to fetch role permissions:', error);
    }
  }
  public async hasPermission(permission: Permissions): Promise<boolean> {
    await this.permissionsLoaded;
    return this.permissions[permission] || false;
  }
}
