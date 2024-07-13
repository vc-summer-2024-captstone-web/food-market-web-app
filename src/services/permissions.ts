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
  constructor(roleId: string) {
    this.roleId = roleId;
    this.getPermissions().catch((error) => {
      console.error(error);
    });
  }

  private async getPermissions() {
    try {
      const role = await db.select().from(Role).where(eq(Role.id, this.roleId))[0];

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
    return this.permissions[permission] || false;
  }
}
