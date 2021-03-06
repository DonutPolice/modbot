import { Bot, Command, Message } from 'yamdbf';
import { User, RichEmbed } from 'discord.js';
import ModBot from '../../lib/ModBot';

export default class History extends Command
{
	public constructor(bot: Bot)
	{
		super(bot, {
			name: 'history',
			aliases: [],
			description: 'Check a user\'s offense history',
			usage: '<prefix>history <@user>',
			extraHelp: '',
			group: 'mod',
			guildOnly: true
		});
	}

	public async action(message: Message, args: Array<string | number>, mentions: User[], original: string): Promise<any>
	{
		if (!(<ModBot> this.bot).mod.canCallModCommand(message)) return;
		const user: User = mentions[0];
		if (!user) return message.channel.sendMessage('You must mention a user to check.');

		if (args[0] === 'reset')
			for (const type of ['warnings', 'mutes', 'kicks', 'softbans', 'bans'])
				message.guild.storage.removeItem(`${type}/${user.id}`);

		const offenses: any = (<ModBot> this.bot).mod.checkUserHistory(message.guild, user);
		const embed: RichEmbed = new RichEmbed()
			.setColor(offenses.color)
			.setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL)
			.setFooter(offenses.toString());
		message.channel.sendEmbed(embed);
	}
}
