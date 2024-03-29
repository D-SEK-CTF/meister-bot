import { Client } from 'discord.js';
import { ValidMemberMessage } from '../utils/validateMessage';
import { CtfChannel } from '../CtfChannel';
import { CtfCategory } from '../CtfCategory';

abstract class Command {
  client: Client;
  requiredRole: string | null;
  showInHelp = true;
  abstract commandName: string;
  abstract usageHelp: string;
  abstract commandDescription: string;

  constructor(client: Client, requiredRole: string | null) {
    if (new.target === Command) {
      throw new TypeError('Cannot construct BaseCommand instances directly');
    }
    this.client = client;
    this.requiredRole = requiredRole;
  }

  abstract execute(
    message: ValidMemberMessage,
    commandChannel: CtfChannel,
    commandCategory: CtfCategory,
    args: string[],
  ): Promise<void>;

  /**
   * Handle a user command from a Discord message
   *
   * @param message Discord message
   * @param argString Arguments to parse
   */
  async handleCommand(
    message: ValidMemberMessage,
    argString: string,
  ): Promise<void> {
    // Ignore the function wrapper, it's just for better error handling
    (async () => {
      // Check if the user has the required role
      this.assertHasRequiredRole(message);

      // Parse the arguments (split by spaces and respecting quotes)
      const args = this.parseArgs(argString);
      const channel = CtfChannel.fromMessage(message);
      const category = CtfCategory.fromMessage(message);
      // Execute the command in each subclass
      await this.execute(message, channel, category, args);
    })
      .call(this)
      .catch((error) => {
        // NOTE: This mainly handles assertion errors with custom messages
        console.error(error);
        message.reply(error.message);
      });
  }

  /**
   * Parse arguments from a string
   *
   * @param content The arguments to parse
   * @returns An array of arguments
   * @throws Error if the arguments are not formatted correctly
   * @example
   * ```ts
   * const args = this.parseArgs(content);
   * ```
   */
  parseArgs(content: string): string[] {
    // Parse the arguments with quotes, both single and double
    const validQuotes = ["'", '"'];
    let lastQuote = '';
    let currentArg = '';
    const args: string[] = [];

    if (content === '') {
      return args;
    }

    // Iterate through each character in the content
    content.split('').forEach((char, index, chars) => {
      if (validQuotes.includes(char)) {
        if (lastQuote === '') {
          if (index !== 0 && chars[index - 1] !== ' ') {
            throw new Error(
              'Invalid argument format: opening quotes must be preceded by a space.',
            );
          }
          lastQuote = char;
        } else if (lastQuote === char) {
          if (index !== chars.length - 1 && chars[index + 1] !== ' ') {
            throw new Error(
              'Invalid argument format: closing quotes must be followed by a space.',
            );
          }
          lastQuote = '';
        } else {
          currentArg += char;
        }
      } else if (char === ' ' && lastQuote === '') {
        args.push(currentArg);
        currentArg = '';
      } else {
        currentArg += char;
      }
    });
    if (lastQuote !== '') {
      throw new Error('Invalid argument format: unclosed quotes.');
    }
    args.push(currentArg);
    return args;
  }

  /**
   * Check if message was sent by user with specific discord role
   *
   * @param message - Discord message
   * @param id - Role ID
   * @returns True if member has role
   * @example
   * ```ts
   * const hasRole = this.hasRoleId(message, '1234567890');
   * if (hasRole) {
   *  // Do something
   * }
   * ```
   */
  hasRequiredRole(message: ValidMemberMessage, id?: string): boolean {
    if (!id) return true;

    const targetRole = id ?? this.requiredRole;
    return message.member
      ? message.member.roles.cache.some((role) => role.id === targetRole)
      : false;
  }

  /**
   * Assert that the number of arguments is equal to a specific length
   *
   * @param args - Arguments
   * @param length - Expected length
   * @throws Error if the number of arguments is not equal to the length
   * @example
   * ```ts
   * this.assertArgsLength(args, 2);
   * ```
   */
  assertArgsLength(args: string[], length: number): void {
    if (args.length !== length) {
      throw new Error(
        `Expected ${length} ${
          length === 1 ? 'argument' : 'arguments'
        }, received ${args.length}.\n\nUsage: \`${this.usageHelp}\``,
      );
    }
  }

  /**
   * Assert that the number of arguments is within a specific range
   *
   * @param args - Arguments
   * @param min - Minimum number of arguments
   * @param max - Maximum number of arguments
   * @throws Error if the number of arguments is not within the range
   * @example
   * ```ts
   * this.assertArgsLengthRange(args, 2, 4);
   * ```
   */
  assertArgsLengthRange(args: string[], min: number, max: number): void {
    if (args.length < min || args.length > max) {
      throw new Error(
        `Expected between ${min} and ${max} ${
          max === 1 ? 'argument' : 'arguments'
        }, received ${args.length}.\n\nUsage: \`${this.usageHelp}\``,
      );
    }
  }

  /**
   * Assert that the message was sent by a user with a specific role
   *
   * @param message - Discord message
   * @param roleId - Role ID
   * @throws Error if the user does not have the role
   */
  assertHasRequiredRole(message: ValidMemberMessage): void {
    if (!this.hasRequiredRole(message)) {
      throw new Error('You do not have permission to use this command.');
    }
  }
}

export default Command;
