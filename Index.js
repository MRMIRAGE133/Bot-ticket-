const { 
    Client, 
    GatewayIntentBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    EmbedBuilder 
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

let ticketCount = 0; // Contador para os tickets

client.once('ready', () => {
    console.log('Bot está online!');
});

client.on('messageCreate', async message => {
    if (message.content === '!criar-ticket') {
        ticketCount++; // Incrementar o contador de tickets
        
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('Compra de Patentes - Exército Brasileiro')
            .setDescription('Ajude o desenvolvimento do nosso jogo! Compre uma patente e apoie o nosso time na criação de novas atualizações e melhorias no mapa.')
            .setThumbnail('https://media.discordapp.net/attachments/1284993703156383865/1293748554036285510/1727658537966_s21nxd_2_0_1.jpg?ex=670880bb&is=67072f3b&hm=be9fb2c5523bd900e5e2f0f4478861b2b602e61ca62db7b218414f4bd42c4d98&') // Coloque uma URL de uma imagem pequena aqui
            .addFields(
                { name: 'Benefícios:', value: '- Apoio ao jogo\n- Acesso a conteúdos exclusivos\n- Suporte direto' },
                { name: 'Desenvolvedores:', value: 'Sua compra nos ajuda a continuar o desenvolvimento do mapa e novas funcionalidades!' }
            );

        const botaoAbrir = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('abrir_ticket')
                .setLabel('Abrir Ticket de Venda')
                .setStyle(ButtonStyle.Success)
        );

        await message.channel.send({ embeds: [embed], components: [botaoAbrir] });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'abrir_ticket') {
        ticketCount++;
        const ticketName = `ticket-de-venda-${ticketCount}`;
        
        // Criar o canal do ticket
        const canal = await interaction.guild.channels.create({
            name: ticketName,
            type: 0, // Tipo de canal de texto
            permissionOverwrites: [
                {
                    id: interaction.guild.id, // Bloqueia visualização para todos
                    deny: ['ViewChannel'],
                },
                {
                    id: interaction.user.id, // Permite visualização ao criador do ticket
                    allow: ['ViewChannel', 'SendMessages'],
                },
                {
                    id: '1292311119549173801', // Permite visualização ao time de suporte
                    allow: ['ViewChannel', 'SendMessages'],
                }
            ],
        });

        // Mensagem embed ao abrir o ticket
        const embedTicket = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Seu ticket foi aberto!')
            .setDescription(`Olá <@${interaction.user.id}>, seu ticket de venda foi aberto. Venha comprar sua patente e aproveitar nossas promoções!\n\n**Pix disponível**: 74 98155-3903\n**CPF**: 046.982.335-69\n**Nome**: Ailza.\nCaso outro vendedor entre em contato, é golpe!`)
            .setFooter({ text: 'Obrigado por apoiar nosso jogo!' });

        const botaoFechar = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('fechar_ticket')
                .setLabel('Fechar Ticket')
                .setStyle(ButtonStyle.Danger)
        );

        await canal.send({ content: `<@${interaction.user.id}>`, embeds: [embedTicket], components: [botaoFechar] });
        
        // Enviar um atalho para o ticket no canal original
        await interaction.reply({ content: `Ticket criado com sucesso! Acesse seu ticket aqui: <#${canal.id}>`, ephemeral: true });
    }

    // Botão de fechar ticket
    if (interaction.customId === 'fechar_ticket') {
        await interaction.reply({ content: 'O ticket será fechado em 7 segundos...', ephemeral: true });
        setTimeout(() => {
            interaction.channel.delete(); // Fecha o canal do ticket após 7 segundos
        }, 7000);
    }
});

client.login('MTI5MzcxMzM5MDc5OTE1OTI5OA.GfiAVW.0OJxkvXkaBpA8_7_TAXDgX7vX3z9Vh_fw-ue8c');
