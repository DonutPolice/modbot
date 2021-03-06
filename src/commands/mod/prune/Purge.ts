import { Bot, Command } from 'yamdbf';
import { User, Message, Collection } from 'discord.js';
import ModBot from '../../../lib/ModBot';

export default class Purge extends Command
{
	public constructor(bot: Bot)
	{
		super(bot, {
			name: 'purge',
			aliases: [],
			description: 'Remove the last given quantity of messages from the channel',
			usage: '<prefix>purge <quantity>',
			extraHelp: 'Can delete up to 100 messages per command call',
			group: 'prune',
			guildOnly: true
		});
	}

	public async action(message: Message, args: Array<string | number>, mentions: User[], original: string): Promise<any>
	{
		if (!(<ModBot> this.bot).mod.canCallModCommand(message)) return;
		const quantity: number = <number> args[0];

		if (!quantity || quantity < 1)
			return message.channel.sendMessage('You must enter a number of messages to purge.');

		let messages: Collection<string, Message>;
		messages = (await message.channel.fetchMessages(
			{ limit: Math.min(quantity, 100), before: message.id }));
		messages.set(message.id, message);

		await message.channel.bulkDelete(messages);
		return message.author.sendMessage('Purge operation completed.');
	}
}
