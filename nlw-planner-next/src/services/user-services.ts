import { EmailNotVerifiedError, UserNotFoundError } from '@/lib/errors'
import { DatabaseServices, IDatabaseServices } from './database-services'
import { createConfirmationToken } from '@/lib/utils'
import { EmailServices, IEmailServices } from './email-services'

export interface IUserServices {
  checkIfEmailIsVerified(email: string): Promise<boolean>
  getUserByEmail(email: string): Promise<User | null>
  getUserById(id: string): Promise<User | null>
  sendEmailVerification(email: string): Promise<void>
}

export class UserServices implements IUserServices {
  private static instance: UserServices | null = null
  private constructor(
    private readonly databaseServices: IDatabaseServices,
    private readonly emailServices: IEmailServices
  ) { }

  public static getInstance(): UserServices {
    if (!UserServices.instance) {
      UserServices.instance = new UserServices(
        DatabaseServices.getInstance(),
        EmailServices.getInstance()
      )
    }
    return UserServices.instance
  }

  async checkIfEmailIsVerified(email: string): Promise<boolean> {
    const user = await this.databaseServices.getUserByEmail(email)
    return user?.isEmailVerified || false
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.databaseServices.getUserByEmail(email)
  }

  async getUserById(id: string): Promise<User | null> {
    return this.databaseServices.getUserById(id)
  }

  async sendEmailVerification(email: string): Promise<void> {
    const user = await this.databaseServices.getUserByEmail(email)

    if (!user) {
      throw new UserNotFoundError(email)
    }

    if (!user.isEmailVerified) {
      throw new EmailNotVerifiedError(email)
    }

    //Generate new confirmation token
    const confirmationToken = createConfirmationToken()
    await this.databaseServices.updateUserConfirmationToken(user.id, confirmationToken)

    //Send email
    this.emailServices.sendUserConfirmationTokenEmail(user, confirmationToken)
  }
}