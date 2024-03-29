import { prefix } from '../const';
import { ValidMemberMessage } from '../utils/validateMessage';
import Command from './BaseCommand';
import { CtfChannel } from '../CtfChannel';
import { CtfCategory } from '../CtfCategory';

class ArchiveCommand extends Command {
  commandName = 'archive ctf';
  usageHelp = `${prefix} ${this.commandName} [CTF-NAME]`;
  commandDescription = 'Archives a CTF, making it read-only.';

  async execute(
    message: ValidMemberMessage,
    commandChannel: CtfChannel,
    commandCategory: CtfCategory,
    args: string[],
  ): Promise<void> {
    this.assertArgsLengthRange(args, 0, 1);

    const [ctfName] = args;

    const category = ctfName
      ? CtfCategory.fromName(ctfName, message.guild, true)
      : commandCategory;

    category.assertNotInGeneral();
    category.assertNotArchived();

    // Rename the category to indicate it's archived
    category.setArchivedName();

    // Set the permissions to read only
    category.setReadOnly();

    // Move the category down
    category.moveToArchivedPosition();

    message.reply(`CTF \`${category.name}\` has been archived.`);
  }
}

export default ArchiveCommand;
