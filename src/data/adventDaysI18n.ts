/**
 * Localized Advent Days Content (i18n)
 * Provides authentic, full translations of themes, reflections, scriptures,
 * activities, locations, and piazza awakenings for all 24 days in Spanish, French,
 * German, Italian, and Portuguese.
 */

export interface DayContentTranslation {
  theme: string;
  location: string;
  dateLabel: string;
  scripture: string;
  reflection: string;
  activity: string;
  piazzaAwakening: string;
  goDeeperLabel?: string;
}

export const DAY_TRANSLATIONS: Record<string, Record<number, DayContentTranslation>> = {
  es: {
    1: {
      theme: "La Luz en el Patio",
      location: "El Farol de Gas del Arco Norte",
      dateLabel: "1 de diciembre",
      scripture: "«El pueblo que andaba en tinieblas vio gran luz.» — Isaías 9:2",
      reflection: "Al caer el crepúsculo invernal sobre los arcos de piedra, se enciende una única lámpara. El Adviento no comienza con un estallido deslumbrante, sino con una chispa silenciosa y paciente. En un mundo acelerado, se nos invita a detenernos y recibir el primer destello de esperanza.",
      activity: "Enciende una vela en tu ventana o mesa esta noche. Envía una breve nota de aliento a alguien que lleve una carga en silencio.",
      piazzaAwakening: "El farol de gas de la calle norte se enciende, proyectando cálidas luces doradas sobre los adoquines.",
      goDeeperLabel: "Explora la tradición de la Corona de Adviento"
    },
    2: {
      theme: "Calor del Hogar",
      location: "La Panadería del Pueblo Antiguo",
      dateLabel: "2 de diciembre",
      scripture: "«Danos hoy nuestro pan cotidiano.» — Mateo 6:11",
      reflection: "De la panadería de techos inclinados brota el aroma a masa recién amasada, canela y almendras tostadas. Compartir el pan siempre ha sido el signo más sagrado de comunión y confianza. El calor existe para ser compartido.",
      activity: "Hornea o compra una hogaza de pan o bollos y regálalos a un vecino o cuidador en tu comunidad.",
      piazzaAwakening: "La panadería se ilumina con fuego ambarino y vapor cálido en la chimenea.",
      goDeeperLabel: "Reflexiona sobre Comunidad y Generosidad"
    },
    3: {
      theme: "La Nieve Susurrante",
      location: "Los Callejones Empedrados",
      dateLabel: "3 de diciembre",
      scripture: "«Estad quietos, y conoced que yo soy Dios.» — Salmo 46:10",
      reflection: "Un silencio sereno cae sobre los tejados mientras los primeros copos de nieve flotan suavemente. La nieve suaviza los bordes duros del mundo. En la quietud del invierno encontramos espacio para escuchar lo que nuestro corazón necesita.",
      activity: "Da un paseo tranquilo de diez minutos en silencio, notando cinco bendiciones por las que estás agradecido.",
      piazzaAwakening: "Una suave nevada volumétrica en 3D cubre los tejados y callejones empedrados.",
      goDeeperLabel: "Meditación diaria sobre la quietud"
    },
    4: {
      theme: "Agua Viva en Invierno",
      location: "La Fuente de Piedra de la Plaza",
      dateLabel: "4 de diciembre",
      scripture: "«El que beba del agua que yo le daré no tendrá sed jamás.» — Juan 4:14",
      reflection: "Incluso bajo las heladas, la centenaria fuente murmura en el centro de la plaza. Nos recuerda un manantial inagotable de vida que el frío no puede congelar ni la tristeza extinguir.",
      activity: "Apoya a un refugio local o iniciativa de ayuda que brinde cobijo y alimentos calientes a quienes lo necesitan.",
      piazzaAwakening: "La fuente de piedra se ilumina con destellos cristalinos y ondas de agua en la plaza.",
      goDeeperLabel: "Descubre iniciativas de cuidado invernal"
    },
    5: {
      theme: "El Aroma de la Hospitalidad",
      location: "El Puesto de Sidra Especiada",
      dateLabel: "5 de diciembre",
      scripture: "«No os olvidéis de la hospitalidad, porque por ella algunos hospedaron ángeles.» — Hebreos 13:2",
      reflection: "Calderos de sidra de manzana especiada con clavo y anís estrellado burbujean sobre brasas. En tiempos fríos, acoger a un extraño con una bebida caliente transforma la distancia en cercanía.",
      activity: "Invita a un amigo o vecino que viva solo a tomar un té caliente o chocolate con una buena charla.",
      piazzaAwakening: "El puesto de sidra abre con toldo a rayas rojas y calderos humeantes.",
      goDeeperLabel: "Práctica de hospitalidad cristiana"
    },
    6: {
      theme: "El Espíritu de San Nicolás",
      location: "El Carretón del Juguetero",
      dateLabel: "6 de diciembre",
      scripture: "«Más bienaventurado es dar que recibir.» — Hechos 20:35",
      reflection: "En el día de San Nicolás, las historias de bondad secreta resuenan por las calles europeas. La verdadera generosidad no busca aplausos, solo aliviar la carga de los demás.",
      activity: "Deja un regalo o detalle secreto para un niño o compañero de trabajo sin poner tu nombre.",
      piazzaAwakening: "El carretón artesanal de cascanueces de madera aparece en la plaza.",
      goDeeperLabel: "Vida histórica de Nicolás de Mira"
    },
    7: {
      theme: "La Melodía de los Villancicos",
      location: "Las Escalinatas de la Catedral",
      dateLabel: "7 de diciembre",
      scripture: "«Cantad alegres a Dios, habitantes de toda la tierra.» — Salmo 100:1",
      reflection: "Un violín canta sobre el bullicio del mercado. Los cantores con bufandas de lana se reúnen en las escalinatas, entonando melodías que han cruzado siglos de inviernos.",
      activity: "Escucha hoy una obra coral o himno clásico de Adviento y canta con corazón gozoso.",
      piazzaAwakening: "El quiosco musical de cantores se ilumina con farolillos de velas.",
      goDeeperLabel: "Escucha coros de la catedral"
    },
    8: {
      theme: "La Ventana de Rosas",
      location: "El Rosal Gótico de la Catedral",
      dateLabel: "8 de diciembre",
      scripture: "«Tu palabra es una lámpara a mis pies y lumbrera a mi camino.» — Salmo 119:105",
      reflection: "La luz interior atraviesa los cristales escarlatas y zafiros del rosetón, proyectando gemas de luz sobre la nieve. Incluso en las noches más frías, la verdad y la belleza brillan desde dentro.",
      activity: "Dedica un tiempo a la lectura meditativa de un salmo o texto sagrado que renueve tu paz interior.",
      piazzaAwakening: "El rosetón gótico se ilumina majestuosamente con cálidos destellos multicolores.",
      goDeeperLabel: "Simbolismo del rosetón de catedral"
    },
    9: {
      theme: "Refugio para el Caminante",
      location: "El Claustro del Monasterio",
      dateLabel: "9 de diciembre",
      scripture: "«El Señor es mi refugio y mi fortaleza.» — Salmo 91:2",
      reflection: "Bajo las arcadas de piedra, el claustro ofrece protección contra el viento helado. Encontrar refugio interior es el regalo que el Adviento ofrece a nuestras mentes cansadas.",
      activity: "Desconecta del teléfono y pantallas durante una hora esta tarde para cultivar la quietud mental.",
      piazzaAwakening: "Farolillos de cobre a lo largo del claustro se encienden con resplandor dorado.",
      goDeeperLabel: "Retiros y oración contemplativa"
    },
    10: {
      theme: "El Tejedor de Mantas",
      location: "El Taller Textil",
      dateLabel: "10 de diciembre",
      scripture: "«Vestíos de entrañable misericordia, de benignidad, de humildad.» — Colosenses 3:12",
      reflection: "Lana hilada a mano tejida en mantas gruesas para proteger del frío invernal. Cada hilo representa un acto de cariño entretejido en la vida comunitaria.",
      activity: "Dona abrigos, bufandas o mantas en buen estado a una organización de ayuda para personas vulnerables.",
      piazzaAwakening: "Estandartes de lana festivos se despliegan en las ventanas del gremio.",
      goDeeperLabel: "Cuidado de los necesitados"
    },
    11: {
      theme: "El Gran Abeto Verde",
      location: "El Abeto Central de la Plaza",
      dateLabel: "11 de diciembre",
      scripture: "«Yo soy como un ciprés verdeante; de mí procede tu fruto.» — Oseas 14:8",
      reflection: "Erigido en el corazón de la plaza, el abeto perenne permanece verde en medio del invierno más severo. Nos recuerda la vida indestructible y la fidelidad eterna de la gracia divina.",
      activity: "Coloca un adorno significativo o símbolo de gratitud en tu hogar y comparte su historia con tu familia.",
      piazzaAwakening: "El majestuoso abeto de Navidad de 4 pisos aparece en el centro de la plaza.",
      goDeeperLabel: "El simbolismo del árbol de Adviento"
    },
    12: {
      theme: "El Dulce de Especias",
      location: "El Puesto de Lebkuchen",
      dateLabel: "12 de diciembre",
      scripture: "«¡Cuán dulces son a mi paladar tus palabras! Más que la miel a mi boca.» — Salmo 119:103",
      reflection: "Galletas de jengibre y miel decoradas con almendras y azúcar glas. La dulzura compartida en comunidad transforma la dureza del invierno en celebración.",
      activity: "Prepara galletas o dulces navideños y compártelos con alguien que esté pasando por un momento difícil.",
      piazzaAwakening: "El puesto de galletas de jengibre y especias se ilumina con guirnaldas doradas.",
      goDeeperLabel: "Tradiciones culinarias de Adviento"
    },
    13: {
      theme: "La Luz de Santa Lucía",
      location: "La Torre Campanario",
      dateLabel: "13 de diciembre",
      scripture: "«Vosotros sois la luz del mundo.» — Mateo 5:14",
      reflection: "En una de las noches más largas del año, doncellas con coronas de velas llevan luz y panecillos de azafrán en la oscuridad. La luz triunfa siempre sobre las sombras.",
      activity: "Haz un gesto de servicio alegre hacia alguien en tu hogar o comunidad a primera hora de la mañana.",
      piazzaAwakening: "La torre campanario enciende una aureola de antorchas en su terraza alta.",
      goDeeperLabel: "La festividad de Santa Lucía"
    },
    14: {
      theme: "Las Cartas de Paz",
      location: "La Oficina Postal Antigua",
      dateLabel: "14 de diciembre",
      scripture: "«Gracia y paz a vosotros de Dios nuestro Padre.» — Filipenses 1:2",
      reflection: "Bajo la luz de una lámpara de queroseno, se escriben cartas a mano para seres queridos distantes. Las palabras sinceras pueden curar heridas y cruzar océanos de separación.",
      activity: "Escribe y envía por correo una carta o tarjeta escrita a mano a un pariente o amigo que no ves hace tiempo.",
      piazzaAwakening: "El buzón histórico de hierro forjado se ilumina con faroles festivos.",
      goDeeperLabel: "Reconciliación y perdón"
    },
    15: {
      theme: "El Reloj de la Torre",
      location: "El Reloj Astronómico de la Plaza",
      dateLabel: "15 de diciembre",
      scripture: "«Para todo hay un tiempo señalado debajo del cielo.» — Eclesiastés 3:1",
      reflection: "El péndulo oscila con ritmo constante mientras las campanas marcan las horas. El Adviento nos enseña la paciencia sagrada: lo mejor no puede apresurarse, debe gestarse.",
      activity: "Pasa 15 minutos en silencio sin mirar el reloj, descansando en la presencia de la paz divina.",
      piazzaAwakening: "La esfera del reloj astronómico brilla con números dorados iluminados.",
      goDeeperLabel: "El tiempo sagrado en la liturgia"
    },
    16: {
      theme: "El Pórtico Abierto",
      location: "La Puerta Mayor de la Catedral",
      dateLabel: "16 de diciembre",
      scripture: "«Abrid las puertas, y entrará la gente justa.» — Isaías 26:2",
      reflection: "Las enormes puertas de roble tallado se abren de par en par, dejando escapar un resplandor cálido de cientos de velas que invita a entrar a todo transeúnte.",
      activity: "Haz que tu hogar sea un lugar acogedor y da una bienvenida cordial a quien toque a tu puerta hoy.",
      piazzaAwakening: "El portal mayor de la catedral se abre revelando una cálida luz interior.",
      goDeeperLabel: "Hospitalidad del santuario"
    },
    17: {
      theme: "El Farol del Camino",
      location: "La Farola de la Calle Oriental",
      dateLabel: "17 de diciembre",
      scripture: "«Guiará nuestros pies por camino de paz.» — Lucas 1:79",
      reflection: "A medida que el Adviento avanza, la luz se propaga. Una segunda farola se enciende al este, enlazando las calles en un sendero iluminado a través de la noche.",
      activity: "Ofrece tu apoyo para guiar o acompañar a alguien que esté pasando por una decisión difícil.",
      piazzaAwakening: "El farol de gas este se enciende, conectando la plaza con luz resplandeciente.",
      goDeeperLabel: "El camino de la sabiduría"
    },
    18: {
      theme: "El Órgano de Tubos",
      location: "La Galería del Coro",
      dateLabel: "18 de diciembre",
      scripture: "«Alabadle con cuerdas y flautas.» — Salmo 150:4",
      reflection: "El aire llena los tubos de estaño y una vibración profunda resuena en las paredes de piedra. La música eleva el espíritu humano cuando las palabras ya no alcanzan.",
      activity: "Disfruta de una pieza de música sacra para órgano y deja que tu espíritu se serene.",
      piazzaAwakening: "Vibraciones armónicas doradas resuenan desde el campanario.",
      goDeeperLabel: "La música sacra y la devoción"
    },
    19: {
      theme: "Las Luces del Abeto",
      location: "Las Ramas del Gran Árbol",
      dateLabel: "19 de diciembre",
      scripture: "«En él estaba la vida, y la vida era la luz de los hombres.» — Juan 1:4",
      reflection: "Decenas de pequeñas bombillas y velas encienden sus chispas en las ramas del abeto. Las pequeñas luces unidas son capaces de transformar la noche más oscura en fiesta.",
      activity: "Reconoce y elogia una pequeña virtud o acto noble que observes hoy en alguien cercano.",
      piazzaAwakening: "48 guirnaldas de luces de hadas parpadeantes se encienden en el gran árbol de Navidad.",
      goDeeperLabel: "La luz de Cristo en el mundo"
    },
    20: {
      theme: "El Misterio del Pesebre",
      location: "El Puesto de Talla de Madera",
      dateLabel: "20 de diciembre",
      scripture: "«Y hallarán al niño envuelto en pañales, acostado en un pesebre.» — Lucas 2:12",
      reflection: "Figuras sencillas talladas en madera de olivo: un buey, una mula, pastores y un establo humilde. El Creador elige la sencillez más pura para manifestar su amor.",
      activity: "Arma o contempla el pesebre en tu hogar, reflexionando en la humildad y sencillez del amor.",
      piazzaAwakening: "El puesto de belenes artesanales de madera de olivo se ilumina con velas.",
      goDeeperLabel: "San Francisco y el primer pesebre"
    },
    21: {
      theme: "El Solsticio de Invierno",
      location: "El Mirador de la Plaza",
      dateLabel: "21 de diciembre",
      scripture: "«La luz resplandece en las tinieblas, y las tinieblas no prevalecieron contra ella.» — Juan 1:5",
      reflection: "En el día con la noche más larga del año, la tierra llega a su punto de inflexión. A partir de hoy, la luz solar comenzará a crecer cada día. La esperanza siempre renace.",
      activity: "Enciende una luz extra en tu hogar y da gracias por los nuevos comienzos que se aproximan.",
      piazzaAwakening: "Haces de luz celestial de invierno descienden suavemente sobre la plaza.",
      goDeeperLabel: "Luz en la oscuridad"
    },
    22: {
      theme: "La Corona de la Paz",
      location: "El Atrio de la Catedral",
      dateLabel: "22 de diciembre",
      scripture: "«Dejará la paz que sobrepasa todo entendimiento.» — Filipenses 4:7",
      reflection: "Cuatro velas arden en la gran corona de follaje verde. La paz no es la ausencia de dificultades, sino la presencia de la gracia en medio de cualquier circunstancia.",
      activity: "Toma la iniciativa de disculparte o perdonar a alguien para restablecer la armonía.",
      piazzaAwakening: "La corona monumental de cuatro velas en el atrio brilla en su plenitud.",
      goDeeperLabel: "Constructores de paz"
    },
    23: {
      theme: "El Dosel de Luces",
      location: "Las Guirnaldas de la Plaza",
      dateLabel: "23 de diciembre",
      scripture: "«Levanta en alto tus ojos y mira.» — Isaías 60:4",
      reflection: "Guirnaldas de luces cuelgan entre los tejados de la plaza como un cielo estrellado a baja altura. La expectación está casi cumplida: el corazón se prepara para la llegada.",
      activity: "Prepara con amor y calma los detalles de tu mesa y cena para compartir en Nochebuena.",
      piazzaAwakening: "El dosel de festones luminosos colgantes ilumina toda la plaza como un manto de estrellas.",
      goDeeperLabel: "Expectación y vigilia de Navidad"
    },
    24: {
      theme: "La Estrella de Belén",
      location: "La Cima del Gran Abeto",
      dateLabel: "24 de diciembre",
      scripture: "«Y la estrella que habían visto en el oriente iba delante de ellos.» — Mateo 2:9",
      reflection: "En la cima del gran abeto resplandece la Estrella de Belén, inundando toda la plaza con una luz deslumbrante. El viaje del Adviento culmina en alegría, comunión y bendición.",
      activity: "Reúnete con tus seres queridos, agradece el don de la vida y comparte el calor de la Nochebuena.",
      piazzaAwakening: "La majestuosa Estrella de Belén se enciende en la cumbre del árbol, bañando toda la plaza en gloria dorada.",
      goDeeperLabel: "Celebración de la Nochebuena"
    }
  },
  fr: {
    1: {
      theme: "La Lumière dans la Cour",
      location: "Le Réverbère à Gaz de l'Arche Nord",
      dateLabel: "1er décembre",
      scripture: "« Le peuple qui marchait dans les ténèbres a vu une grande lumière. » — Ésaïe 9:2",
      reflection: "Tandis que le crépuscule d'hiver enveloppe les arches séculaires, une unique lanterne s'allume. L'Avent commence par une étincelle patiente et paisible. Nous sommes invités à accueillir la première lueur d'espérance.",
      activity: "Allumez une bougie à votre fenêtre ce soir. Envoyez un mot d'encouragement à une personne isolée.",
      piazzaAwakening: "Le réverbère à gaz du nord s'allume, projetant des reflets dorés sur les pavés.",
      goDeeperLabel: "Découvrir la tradition de la couronne de l'Avent"
    },
    2: {
      theme: "La Chaleur du Fournil",
      location: "La Boulangerie de la Vieille Ville",
      dateLabel: "2 décembre",
      scripture: "« Donne-nous aujourd'hui notre pain de ce jour. » — Matthieu 6:11",
      reflection: "De la boulangerie aux toits pentus s'échappe le parfum du pain chaud, de la cannelle et des amandes. Partager le pain est le symbole le plus pur de fraternité et de confiance.",
      activity: "Offrez un pain frais ou une brioche à un voisin ou un soignant de votre quartier.",
      piazzaAwakening: "La vitrine de la boulangerie s'illumine d'une douce lueur ambrée.",
      goDeeperLabel: "Réflexion sur le partage et la communauté"
    },
    3: {
      theme: "La Neige Murmurante",
      location: "Les Ruelles Pavées",
      dateLabel: "3 décembre",
      scripture: "« Arrêtez-vous, et sachez que je suis Dieu. » — Psaume 46:10",
      reflection: "Le silence descend sur les toitures alors que les premiers flocons virevoltent doucement. Dans le calme de l'hiver, nous trouvons le temps d'écouter les aspirations de notre cœur.",
      activity: "Marchez dix minutes dans le silence en remarquant cinq motifs de gratitude.",
      piazzaAwakening: "Une chute de neige volumétrique en 3D recouvre doucement la piazza.",
      goDeeperLabel: "Méditation sur le recueillement"
    },
    4: {
      theme: "L'Eau Vive en Hiver",
      location: "La Fontaine en Pierre",
      dateLabel: "4 décembre",
      scripture: "« Celui qui boira de l'eau que je lui donnerai n'aura plus jamais soif. » — Jean 4:14",
      reflection: "Même par grand froid, la fontaine murmure au cœur de la place. Elle évoque une source intarissable de vie que les frimas de l'hiver ne sauraient tarir.",
      activity: "Soutenez une action de solidarité offrant chaleur et repas chauds aux personnes sans-abri.",
      piazzaAwakening: "La fontaine s'illumine de reflets de glace cristalline et d'ondulations d'eau.",
      goDeeperLabel: "Agir pour les personnes vulnérables"
    },
    5: {
      theme: "Les Épices de l'Hospitalité",
      location: "L'Échoppe de Cidre Chaud",
      dateLabel: "5 décembre",
      scripture: "« N'oubliez pas l'hospitalité, car en l'exerçant, certains ont logé des anges. » — Hébreux 13:2",
      reflection: "Les chaudrons de cidre épicé à la cannelle et aux clous de girofle frémissent sur les braises. Accueillir un passant avec une boisson chaude transforme l'hiver en fête.",
      activity: "Invitez un voisin ou un ami vivant seul à partager un thé chaud ou un chocolat.",
      piazzaAwakening: "L'échoppe de cidre épicé s'ouvre avec son auvent rayé et ses cuivres luisants.",
      goDeeperLabel: "Vivre l'hospitalité de l'Avent"
    },
    6: {
      theme: "La Joie de Saint Nicolas",
      location: "La Charrette du Faiseur de Jouets",
      dateLabel: "6 décembre",
      scripture: "« Il y a plus de bonheur à donner qu'à recevoir. » — Actes 20:35",
      reflection: "Au jour de la Saint-Nicolas, la générosité anonyme s'éveille. Donner sans attendre d'éloges soulage les fardeaux et répand la joie.",
      activity: "Déposez une surprise ou une friandise secrète pour un enfant ou un collègue.",
      piazzaAwakening: "La charrette de casse-noisettes en bois sculpté apparaît dans la place.",
      goDeeperLabel: "La vie de saint Nicolas"
    },
    7: {
      theme: "Le Chant des Choristes",
      location: "Le Parvis de la Cathédrale",
      dateLabel: "7 décembre",
      scripture: "« Poussez des cris de joie vers l'Éternel, habitants de toute la terre ! » — Psaume 100:1",
      reflection: "Les violons s'élèvent au-dessus du marché. Les voix des choristes unies dans la fraîcheur nocturne portent des mélodies nées il y a des siècles.",
      activity: "Écoutez un chant choral de l'Avent et laissez la musique éveiller votre paix intérieure.",
      piazzaAwakening: "Le kiosque des choristes s'illumine de lanternes à bougies.",
      goDeeperLabel: "Les chants sacrés de la cathédrale"
    },
    8: {
      theme: "La Rose de Lumière",
      location: "La Rosace Gothique",
      dateLabel: "8 décembre",
      scripture: "« Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. » — Psaume 119:105",
      reflection: "La lueur intérieure traverse les vitraux bleu et pourpre de la rosace. Même au cœur de la nuit, la beauté et la clarté brillent avec splendeur.",
      activity: "Consacrez quelques instants à la lecture d'un texte qui élève l'âme.",
      piazzaAwakening: "La rosace de la cathédrale s'illumine de feux chatoyants.",
      goDeeperLabel: "Symbolisme des vitraux"
    },
    9: {
      theme: "Le Refuge du Voyageur",
      location: "Le Cloître du Monastère",
      dateLabel: "9 décembre",
      scripture: "« Le Seigneur est mon refuge et ma forteresse. » — Psaume 91:2",
      reflection: "Les galeries de pierre protègent du vent glacial. Trouver la paix intérieure est la promesse offerte à chaque pèlerin de l'Avent.",
      activity: "Accordez-vous une heure sans écran pour savourer le silence intérieur.",
      piazzaAwakening: "Des lanternes en cuivre s'illuminent le long du cloître.",
      goDeeperLabel: "Prière et sérénité"
    },
    10: {
      theme: "Le Tisseur de Laine",
      location: "L'Atelier des Tisserands",
      dateLabel: "10 décembre",
      scripture: "« Revêtez-vous de compassion, de bonté et d'humilité. » — Colossiens 3:12",
      reflection: "La laine chaude protège du froid mordant. Chaque maille est comme un geste de sollicitude envers son prochain.",
      activity: "Faites don d'un vêtement chaud à une association d'aide aux plus démunis.",
      piazzaAwakening: "Des bannières de laine chaude sont hissées aux fenêtres de la guilde.",
      goDeeperLabel: "Solidarité hivernale"
    },
    11: {
      theme: "Le Grand Sapin Vert",
      location: "Le Sapin Monumental de la Place",
      dateLabel: "11 décembre",
      scripture: "« Je suis comme un cyprès toujours vert ; c'est de moi que tu reçois ton fruit. » — Osée 14:8",
      reflection: "Toujours verdoyant sous le givre, le sapin témoigne de la fidélité de la vie qui ne s'éteint jamais.",
      activity: "Accrochez un ornement symbolique chez vous et partagez son histoire en famille.",
      piazzaAwakening: "Le grand sapin de Noël s'élève fièrement au centre de la piazza.",
      goDeeperLabel: "Origine du sapin de Noël"
    },
    12: {
      theme: "Le Pain d'Épices Doré",
      location: "L'Échoppe de Pain d'Épices",
      dateLabel: "12 décembre",
      scripture: "« Que tes paroles sont douces à mon palais, plus que le miel à ma bouche ! » — Psaume 119:103",
      reflection: "Le miel, le gingembre et les amandes célèbrent la douceur de vivre partagée dans l'attente de Noël.",
      activity: "Confectionnez des friandises et offrez-les à une personne qui vit une période difficile.",
      piazzaAwakening: "L'échoppe de pain d'épices s'illumine de guirlandes chaudes.",
      goDeeperLabel: "Douceurs de l'Avent"
    },
    13: {
      theme: "La Clarté de Sainte-Lucie",
      location: "Le Clocher de la Tour",
      dateLabel: "13 décembre",
      scripture: "« Vous êtes la lumière du monde. » — Matthieu 5:14",
      reflection: "Au cœur des nuits les plus sombres, la lumière se lève. Les cierges allumés rappellent que la nuit cède toujours le pas au jour.",
      activity: "Commencez votre journée par un geste attentionné et joyeux envers votre entourage.",
      piazzaAwakening: "La galerie haute du clocher s'illumine de flambeaux éclatants.",
      goDeeperLabel: "La tradition de Sainte-Lucie"
    },
    14: {
      theme: "Les Lettres de Paix",
      location: "L'Ancien Relais de Poste",
      dateLabel: "14 de décembre",
      scripture: "« Que la grâce et la paix vous soient données de la part de Dieu notre Père. » — Philippiens 1:2",
      reflection: "Écrire une lettre à la main ravive les liens précieux au-delà des distances et du temps.",
      activity: "Écrivez et postez une carte de vœux manuscrite à un ami lointain.",
      piazzaAwakening: "La boîte aux lettres en fer forgé s'illumine de veilleuses festives.",
      goDeeperLabel: "Pardon et réconciliation"
    },
    15: {
      theme: "L'Horloge du Temps",
      location: "L'Horloge Astronomique",
      dateLabel: "15 décembre",
      scripture: "« Il y a un temps pour tout sous le ciel. » — Ecclésiaste 3:1",
      reflection: "Le balancier s'égrène lentement. L'Avent nous apprend la patience sacrée de l'attente féconde.",
      activity: "Passez un quart d'heure en silence sans regarder l'heure, dans le repos de l'esprit.",
      piazzaAwakening: "Le cadran astronomique s'illumine de chiffres dorés étincelants.",
      goDeeperLabel: "Le temps de l'Avent"
    },
    16: {
      theme: "Le Grand Portail Ouvert",
      location: "Le Portail Royal de la Cathédrale",
      dateLabel: "16 décembre",
      scripture: "« Ouvrez les portes, laissez entrer la nation juste. » — Ésaïe 26:2",
      reflection: "Les lourdes portes de chêne sculpté s'ouvrent, laissant filtrer la chaude clarté de mille cierges.",
      activity: "Faites de votre foyer un havre d'accueil et ouvrez votre cœur à ceux qui frappent à votre porte.",
      piazzaAwakening: "Le grand portail s'ouvre, révélant une chaude lumière d'espérance.",
      goDeeperLabel: "L'accueil du sanctuaire"
    },
    17: {
      theme: "Le Deuxième Réverbère",
      location: "La Rue de l'Est",
      dateLabel: "17 décembre",
      scripture: "« Il guidera nos pas sur le chemin de la paix. » — Luc 1:79",
      reflection: "La clarté se propage. Le second réverbère trace un chemin lumineux à travers la nuit d'hiver.",
      activity: "Tendez la main à quelqu'un qui cherche son chemin ou vit un doute.",
      piazzaAwakening: "Le réverbère est s'allume, reliant les ruelles dans la lumière.",
      goDeeperLabel: "Le chemin de la paix"
    },
    18: {
      theme: "Le Souffle de l'Orgue",
      location: "La Tribune de l'Orgue",
      dateLabel: "18 décembre",
      scripture: "« Louez-le avec les instruments à cordes et le chalumeau ! » — Psaume 150:4",
      reflection: "Les tuyaux d'étain vibrent et emplissent la voûte d'une majesté céleste. La musique exprime l'indicible.",
      activity: "Écoutez une cantate ou une œuvre d'orgue de l'Avent pour nourrir votre paix.",
      piazzaAwakening: "Des résonances d'or harmonieuses résonnent depuis la tour.",
      goDeeperLabel: "La musique d'orgue sacrée"
    },
    19: {
      theme: "Les Guirlandes Scintillantes",
      location: "Les Rameaux du Grand Sapin",
      dateLabel: "19 décembre",
      scripture: "« En elle était la vie, et la vie était la lumière des hommes. » — Jean 1:4",
      reflection: "Les branches du sapin s'illuminent de mille points scintillants. Les petites clartés réunies font reculer l'obscurité.",
      activity: "Soulignez et remerciez une gentillesse discrète accomplie par un proche aujourd'hui.",
      piazzaAwakening: "48 lumières féeriques s'allument sur les branches du grand sapin.",
      goDeeperLabel: "Lumière et espérance"
    },
    20: {
      theme: "La Crèche de Bois",
      location: "L'Atelier du Sculpteur",
      dateLabel: "20 décembre",
      scripture: "« Vous trouverez un nouveau-né emmailloté et couché dans une mangeoire. » — Luc 2:12",
      reflection: "Des silhouettes taillées dans l'olivier : bergers, boeuf et mangeoire. La simplicité absolue accueille l'infini.",
      activity: "Prenez un moment devant une crèche pour méditer sur l'humilité et la tendresse.",
      piazzaAwakening: "L'échoppe de crèches en bois d'olivier s'illumine de veilleuses.",
      goDeeperLabel: "La crèche de saint François"
    },
    21: {
      theme: "Le Solstice d'Hiver",
      location: "L'Esplanade de la Piazza",
      dateLabel: "21 décembre",
      scripture: "« La lumière luit dans les ténèbres, et les ténèbres ne l'ont point arrêtée. » — Jean 1:5",
      reflection: "Au jour le plus court de l'année, le soleil amorce son retour. L'espérance refleurit toujours au cœur du froid.",
      activity: "Allumez une veilleuse supplémentaire pour célébrer le retour de la lumière.",
      piazzaAwakening: "Des faisceaux de lumière hivernale éclairent doucement la piazza.",
      goDeeperLabel: "La victoire du jour"
    },
    22: {
      theme: "La Flamme de la Paix",
      location: "L'Atrium de la Cathédrale",
      dateLabel: "22 décembre",
      scripture: "« La paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs. » — Philippiens 4:7",
      reflection: "Les quatre bougies de la couronne resplendissent. La paix divine est un don qui apaise toutes les tempêtes.",
      activity: "Pardonnez ou demandez pardon pour sceller une réconciliation durable.",
      piazzaAwakening: "Les quatre cierges monumentaux de l'atrium brillent d'un éclat fervent.",
      goDeeperLabel: "Artisans de paix"
    },
    23: {
      theme: "Le Ciel Étoilé de la Place",
      location: "Les Festons de la Piazza",
      dateLabel: "23 décembre",
      scripture: "« Lève tes yeux tout autour, et regarde ! » — Ésaïe 60:4",
      reflection: "Des guirlandes suspendues d'un toit à l'autre créent un ciel d'étoiles dorées. L'attente touche à sa fin.",
      activity: "Finalisez vos préparatifs dans la sérénité et la joie partagée.",
      piazzaAwakening: "Le ciel suspendu de festons illumine toute la place d'un dôme féerique.",
      goDeeperLabel: "Veillée de Noël"
    },
    24: {
      theme: "L'Étoile de Bethléem",
      location: "Le Faîte du Grand Sapin",
      dateLabel: "24 décembre",
      scripture: "« Et l'étoile qu'ils avaient vue en Orient marchait devant eux. » — Matthieu 2:9",
      reflection: "L'Étoile au sommet du grand sapin inonde la piazza d'une gloire dorée. Le pèlerinage de l'Avent s'achève dans l'émerveillement et la paix.",
      activity: "Rassemblez-vous avec vos proches et partagez la joie de la Nativité.",
      piazzaAwakening: "L'Étoile de Bethléem s'illumine au sommet du sapin, baignant la piazza de lumière céleste.",
      goDeeperLabel: "Célébration de la Nativité"
    }
  },
  de: {
    1: {
      theme: "Das Licht im Hof",
      location: "Die Gaslaterne am Nordbogen",
      dateLabel: "1. Dezember",
      scripture: "„Das Volk, das im Finstern wandelt, sieht ein großes Licht.“ — Jesaja 9,1",
      reflection: "Wenn die Winterdämmerung die alten Steinbögen umhüllt, wird eine einzelne Laterne entzündet. Der Advent beginnt mit einem leisen Funken der Hoffnung.",
      activity: "Zünden Sie heute Abend eine Kerze am Fenster an und senden Sie einer lieben Person ein ermutigendes Wort.",
      piazzaAwakening: "Die Gaslaterne der Nordstraße entzündet sich und wirft goldenes Licht auf das Kopfsteinpflaster.",
      goDeeperLabel: "Die Tradition des Adventskranzes"
    },
    2: {
      theme: "Wärme aus der Backstube",
      location: "Die Altstadtbäckerei",
      dateLabel: "2. Dezember",
      scripture: "„Unser tägliches Brot gib uns heute.“ — Matthäus 6,11",
      reflection: "Aus der gemütlichen Bäckerei duftet es nach frischem Brot, Zimt und gerösteten Mandeln. Geteiltes Brot ist das schönste Zeichen von Gemeinschaft.",
      activity: "Schenken Sie einem Nachbarn oder Helfer ein frisches Brot oder Gebäck.",
      piazzaAwakening: "Die Bäckerei erleuchtet in warmem Bernsteinlicht mit sanftem Kaminrauch.",
      goDeeperLabel: "Gemeinschaft und Fürsorge"
    },
    3: {
      theme: "Flüsternder Schnee",
      location: "Die Pflastergassen",
      dateLabel: "3. Dezember",
      scripture: "„Seid still und erkennt, dass ich Gott bin.“ — Psalm 46,11",
      reflection: "Lautlos gleiten die ersten Schneeflocken auf die Giebel herab. Im Stillesein des Winters öffnen wir unser Herz für das Wesentliche.",
      activity: "Machen Sie einen ruhigen Spaziergang und nennen Sie im Stillen fünf Dinge, für die Sie dankbar sind.",
      piazzaAwakening: "Sanfter 3D-Schneefall hüllt die Dächer und Gassen der Piazza ein.",
      goDeeperLabel: "Besinnung und Stille"
    },
    4: {
      theme: "Lebendiges Wasser im Frost",
      location: "Der Brunnen der Piazza",
      dateLabel: "4. Dezember",
      scripture: "„Wer von dem Wasser trinkt, das ich ihm gebe, den wird nicht dürsten.“ — Johannes 4,14",
      reflection: "Selbst bei eisigen Temperaturen plätschert der Brunnen unermüdlich im Zentrum. Er erinnert an die Quelle des Lebens, die niemals versiegt.",
      activity: "Unterstützen Sie ein Hilfswerk, das Bedürftigen in der Kälte Obdach und Wärme schenkt.",
      piazzaAwakening: "Der Brunnen erstrahlt mit funkelndem Eisglanz und sanften Wasserwellen.",
      goDeeperLabel: "Nächstenliebe im Winter"
    },
    5: {
      theme: "Der Duft der Gastfreundschaft",
      location: "Der Würzapfel-Stand",
      dateLabel: "5. Dezember",
      scripture: "„Vergesst die Gastfreundschaft nicht; denn durch sie haben einige Engel beherbergt.“ — Hebräer 13,2",
      reflection: "Kupferkessel mit heißem Apfelpunsch, Nelken und Sternanis wärmen die Vorübergehenden. Ein heißes Getränk verwandelt Fremde in Freunde.",
      activity: "Laden Sie jemanden auf eine Tasse Tee oder Punsch zu einem guten Gespräch ein.",
      piazzaAwakening: "Der Holzstand öffnet mit rot-weißem Baldachin und dampfenden Kesseln.",
      goDeeperLabel: "Gelebte Gastfreundschaft"
    },
    6: {
      theme: "Der Geist des Heiligen Nikolaus",
      location: "Der Spielzeugmacher-Karren",
      dateLabel: "6. Dezember",
      scripture: "„Geben ist seliger als Nehmen.“ — Apostelgeschichte 20,35",
      reflection: "Am Nikolaustag feiern wir die Freude des uneigennützigen Schenkens, das Herzen erwärmt, ohne nach Anerkennung zu verlangen.",
      activity: "Hinterlassen Sie einem Kind oder Kollegen eine kleine geheime Aufmerksamkeit.",
      piazzaAwakening: "Ein hölzerner Handwerkskarren mit geschnitzten Nussknackern erscheint auf dem Platz.",
      goDeeperLabel: "Das Leben des heiligen Nikolaus"
    },
    7: {
      theme: "Der Klang der Chöre",
      location: "Die Domstufen",
      dateLabel: "7. Dezember",
      scripture: "„Jauchzet dem Herrn, alle Welt!“ — Psalm 100,1",
      reflection: "Geigenklänge und Chorgesänge steigen in den Winterhimmel auf. Alte Melodien verbinden Generationen im Geist der Zuversicht.",
      activity: "Hören Sie ein klassisches Adventslied und stimmen Sie von Herzen mit ein.",
      piazzaAwakening: "Der Pavillon der Sänger erstrahlt im Kerzenschein.",
      goDeeperLabel: "Kirchenmusik im Advent"
    },
    8: {
      theme: "Die Rosette des Doms",
      location: "Die Gotische Domrosette",
      dateLabel: "8. Dezember",
      scripture: "„Dein Wort ist meines Fußes Leuchte und ein Licht auf meinem Wege.“ — Psalm 119,105",
      reflection: "Farbenprächtiges Glas funkelt in der Nacht. Das innere Licht leuchtet kraftvoll durch alle Dunkelheit hindurch.",
      activity: "Nehmen Sie sich Zeit für die besinnliche Lektüre eines geistlichen Textes.",
      piazzaAwakening: "Die große Domrosette erstrahlt in festlichem Farbenspiel.",
      goDeeperLabel: "Die Symbolik der Domfenster"
    },
    9: {
      theme: "Zuflucht im Kreuzgang",
      location: "Der Klosterkreuzgang",
      dateLabel: "9. Dezember",
      scripture: "„Der Herr ist meine Zuflucht und meine Burg.“ — Psalm 91,2",
      reflection: "Hinter alten Steinbögen finden wir Schutz vor dem eisigen Wind und einen Ort des inneren Friedens.",
      activity: "Gönnen Sie sich eine meditative Stunde ohne Handy und Hektik.",
      piazzaAwakening: "Kupferlaternen erhellen den Kreuzgang mit sanftem Schein.",
      goDeeperLabel: "Innere Einkehr"
    },
    10: {
      theme: "Wärmende Decken",
      location: "Die Weberstube",
      dateLabel: "10. Dezember",
      scripture: "„Zieht nun an herzliches Erbarmen, Freundlichkeit und Demut.“ — Kolosser 3,12",
      reflection: "Gewebte Wolle schützt vor der Kälte. Jede Masche steht für gelebte Achtsamkeit und Fürsorge.",
      activity: "Spenden Sie warme Kleidung an eine lokale Hilfsorganisation.",
      piazzaAwakening: "Festliche Wolltücher schmücken die Fenster der Handwerkerzunft.",
      goDeeperLabel: "Hilfe für Obdachlose"
    },
    11: {
      theme: "Der Immergrüne Weihnachtsbaum",
      location: "Der Große Christbaum",
      dateLabel: "11. Dezember",
      scripture: "„Ich bin wie eine grünende Zypresse; von mir kommt deine Frucht.“ — Hosea 14,9",
      reflection: "Grün inmitten des tiefen Schnees: Die Tanne symbolisiert das unvergängliche Leben und die göttliche Treue.",
      activity: "Hängen Sie einen besonderen Schmuck an Ihren Baum und erzählen Sie dessen Bedeutung.",
      piazzaAwakening: "Der prächtige, vierstöckige Christbaum erstrahlt auf der Piazza.",
      goDeeperLabel: "Die Bedeutung des Weihnachtsbaums"
    },
    12: {
      theme: "Süßer Lebkuchenduft",
      location: "Die Lebkuchenbude",
      dateLabel: "12. Dezember",
      scripture: "„Wie süß sind meine Worte meinem Gaumen, mehr als Honig meinem Munde!“ — Psalm 119,103",
      reflection: "Honig, Nüsse und Gewürze machen die Tage der Erwartung zu einem Fest der Freude und Gastlichkeit.",
      activity: "Backen Sie Plätzchen und schenken Sie einer einsamen Person eine Freude.",
      piazzaAwakening: "Die Lebkuchenbude öffnet im warmen Lichterglanz.",
      goDeeperLabel: "Weihnachtliche Backtraditionen"
    },
    13: {
      theme: "Das Licht der heiligen Lucia",
      location: "Der Glockenturm",
      dateLabel: "13. Dezember",
      scripture: "„Ihr seid das Licht der Welt.“ — Matthäus 5,14",
      reflection: "In den längsten Nächten kündet der Kerzenschein vom Sieg des Lichts über alle Dunkelheit.",
      activity: "Erfreuen Sie Ihre Mitmenschen heute früh mit einer freundlichen Geste.",
      piazzaAwakening: "Auf der Turmgalerie leuchten helle Fackeln auf.",
      goDeeperLabel: "Das Luciafest"
    },
    14: {
      theme: "Briefe des Friedens",
      location: "Die Alte Poststation",
      dateLabel: "14. Dezember",
      scripture: "„Gnade sei mit euch und Friede von Gott, unserem Vater.“ — Philipper 1,2",
      reflection: "Handgeschriebene Zeilen überwinden jede Ferne und schenken Verbundenheit von Herz zu Herz.",
      activity: "Schreiben Sie einen handgeschriebenen Weihnachtsbrief an einen lieben Menschen.",
      piazzaAwakening: "Der historische Postkasten wird feierlich beleuchtet.",
      goDeeperLabel: "Versöhnung und Frieden"
    },
    15: {
      theme: "Die Turmuhr",
      location: "Die Astronomische Uhr",
      dateLabel: "15. Dezember",
      scripture: "„Ein jegliches hat seine Zeit unter dem Himmel.“ — Prediger 3,1",
      reflection: "Gleichmäßig tickt das Pendel. Advent lehrt uns die heilige Kunst des geduldigen Wartens.",
      activity: "Ruhen Sie eine Viertelstunde ohne Blick auf die Uhr in innerer Gelassenheit.",
      piazzaAwakening: "Das Zifferblatt der astronomischen Uhr erstrahlt in goldenem Glanz.",
      goDeeperLabel: "Geduld und Zeit"
    },
    16: {
      theme: "Das Offene Domportal",
      location: "Das Hauptportal des Doms",
      dateLabel: "16. Dezember",
      scripture: "„Tut die Tore auf, dass einziehe das gerechte Volk.“ — Jesaja 26,2",
      reflection: "Weit öffnen sich die mächtigen Eichentore und laden jeden Suchenden in den wärmenden Schein ein.",
      activity: "Öffnen Sie Ihr Herz und heißen Sie Besucher stets herzlich willkommen.",
      piazzaAwakening: "Das Domportal öffnet sich und offenbart goldenes Kerzenlicht.",
      goDeeperLabel: "Offene Kirche"
    },
    17: {
      theme: "Die Östliche Straßenlaterne",
      location: "Der Ostbogen",
      dateLabel: "17. Dezember",
      scripture: "„Er richte unsere Füße auf den Weg des Friedens.“ — Lukas 1,79",
      reflection: "Das Licht wächst: Eine weitere Laterne verbindet die Straßen zu einem sicheren Pfad durch die Nacht.",
      activity: "Seien Sie heute jemandem ein aufmunternder Wegbegleiter.",
      piazzaAwakening: "Die östliche Gaslaterne spendet warmes Licht auf den Wegen.",
      goDeeperLabel: "Wege des Friedens"
    },
    18: {
      theme: "Die Domorgel",
      location: "Die Orgelempore",
      dateLabel: "18. Dezember",
      scripture: "„Lobet ihn mit Saitenspiel und Pfeifen!“ — Psalm 150,4",
      reflection: "Mächtige Orgelpfeifen erfüllen den Raum mit erhebendem Klang. Musik spricht dort, wo Worte enden.",
      activity: "Lauschen Sie einem feierlichen Orgelstück zur Einstimmung auf das Fest.",
      piazzaAwakening: "Goldene Klangwellen strömen aus dem Glockenturm.",
      goDeeperLabel: "Geistliche Musik"
    },
    19: {
      theme: "Lichterglanz am Baum",
      location: "Die Zweige der Tanne",
      dateLabel: "19. Dezember",
      scripture: "„In ihm war das Leben, und das Leben war das Licht der Menschen.“ — Johannes 1,4",
      reflection: "Zahllose kleine Lichter verwandeln den Baum in ein strahlendes Wunderwerk der Freude.",
      activity: "Loben Sie heute aufrichtig eine gute Tat in Ihrem Umfeld.",
      piazzaAwakening: "48 funkelnde Lichterketten erleuchten den großen Baum.",
      goDeeperLabel: "Licht im Leben"
    },
    20: {
      theme: "Die Hölzerne Krippe",
      location: "Die Schnitzerwerkstatt",
      dateLabel: "20. Dezember",
      scripture: "„Ihr werdet finden das Kind in Windeln gewickelt und in einer Krippe liegend.“ — Lukas 2,12",
      reflection: "Einfache Figuren aus Olivenholz: In tiefster Demut offenbart sich die größte Liebe.",
      activity: "Betrachten Sie eine Krippe und bedenken Sie das Geheimnis der Einfachheit.",
      piazzaAwakening: "Die Krippenbude erstrahlt im Schein kleiner Kerzen.",
      goDeeperLabel: "Die Geschichte der Weihnachtskrippe"
    },
    21: {
      theme: "Die Wintersonnenwende",
      location: "Die Aussichtsplattform",
      dateLabel: "21. Dezember",
      scripture: "„Das Licht scheint in der Finsternis, und die Finsternis hat's nicht begriffen.“ — Johannes 1,5",
      reflection: "Die längste Nacht weicht dem neu aufsteigenden Licht. Hoffnung triumphiert stets über Kälte und Dunkelheit.",
      activity: "Entzünden Sie eine zusätzliche Kerze als Zeichen der Zuversicht.",
      piazzaAwakening: "Helle Himmelsstrahlen fallen sanft auf die Piazza herab.",
      goDeeperLabel: "Sieg des Lichts"
    },
    22: {
      theme: "Der Friedenskranz",
      location: "Das Atrium des Doms",
      dateLabel: "22. Dezember",
      scripture: "„Der Friede Gottes, der höher ist als alle Vernunft, bewahre eure Herzen.“ — Philipper 4,7",
      reflection: "Vier Kerzen brennen nun hell. Wahrer Friede schenkt Ruhe inmitten aller Stürme.",
      activity: "Reichen Sie jemandem die Hand zur Versöhnung.",
      piazzaAwakening: "Vier monumentale Kerzen im Atrium strahlen in voller Pracht.",
      goDeeperLabel: "Frieden stiften"
    },
    23: {
      theme: "Das Festliche Lichterzelt",
      location: "Die Girlanden der Piazza",
      dateLabel: "23. Dezember",
      scripture: "„Hebe deine Augen auf ringsum und sieh!“ — Jesaja 60,4",
      reflection: "Lichtergirlanden spannen sich wie ein Sternenhimmel über den Platz. Das Fest der Geburt steht bevor.",
      activity: "Schließen Sie Ihre Vorbereitungen in Ruhe und Vorfreude ab.",
      piazzaAwakening: "Ein funkelndes Baldachin-Lichterzelt erleuchtet den gesamten Platz.",
      goDeeperLabel: "Heiliger Abend im Anmarsch"
    },
    24: {
      theme: "Der Stern von Bethlehem",
      location: "Die Spitze des Christbaums",
      dateLabel: "24. Dezember",
      scripture: "„Und siehe, der Stern, den sie im Morgenland gesehen hatten, ging vor ihnen her.“ — Matthäus 2,9",
      reflection: "Auf der Spitze des Baumes erstrahlt der Stern und taucht die Piazza in goldenen Glanz. Die Adventsreise mündet in Freude, Frieden und Gemeinschaft.",
      activity: "Feiern Sie den Heiligen Abend in Dankbarkeit mit Ihren Liebsten.",
      piazzaAwakening: "Der Stern von Bethlehem erleuchtet strahlend die Spitze des Baumes und taucht die Piazza in festlichen Glanz.",
      goDeeperLabel: "Die Heilige Nacht"
    }
  },
  it: {
    1: {
      theme: "La Luce nel Cortile",
      location: "Il Lampione a Gas dell'Arco Nord",
      dateLabel: "1 dicembre",
      scripture: "«Il popolo che camminava nelle tenebre ha visto una grande luce.» — Isaia 9:2",
      reflection: "Mentre il crepuscolo invernale scende sui vicoli di pietra, una lampada solitaria si accende. L'Avvento inizia con una scintilla calma e paziente. Siamo invitati ad accogliere il primo bagliore della speranza.",
      activity: "Accendi una candela sul davanzale o sulla tavola. Invia un messaggio affettuoso a una persona sola.",
      piazzaAwakening: "Il lampione a gas di via Nord si accende, proiettando riflessi d'oro sul selciato.",
      goDeeperLabel: "La tradizione della corona d'Avvento"
    },
    2: {
      theme: "Il Calore del Forno",
      location: "Il Forno del Borgo Antico",
      dateLabel: "2 dicembre",
      scripture: "«Dacci oggi il nostro pane quotidiano.» — Matteo 6:11",
      reflection: "Dalla bottega all'angolo si diffonde il profumo di pane caldo, cannella e mandorle. Condividere il pane è da sempre il segno più sacro di fraternità e fiducia.",
      activity: "Dona una pagnotta fresca o un dolce a un vicino di casa o a chi si prende cura degli altri.",
      piazzaAwakening: "Il forno si illumina di bagliori caldi con fumo lieve dal camino.",
      goDeeperLabel: "Comunità e condivisione"
    },
    3: {
      theme: "La Neve Sussurrata",
      location: "I Vicoli di Pietra",
      dateLabel: "3 dicembre",
      scripture: "«Fermatevi e sappiate che io sono Dio.» — Salmo 46:10",
      reflection: "Un silenzio sereno scende sui tetti mentre i primi fiocchi danzano nell'aria. Nel silenzio invernale troviamo lo spazio per ascoltare il nostro cuore.",
      activity: "Fai una passeggiata silenziosa di dieci minuti, riconoscendo cinque doni per cui sei grato.",
      piazzaAwakening: "Una nevicata volumetrica 3D si posa sui tetti e sulle strade della piazza.",
      goDeeperLabel: "Meditazione sul raccoglimento"
    },
    4: {
      theme: "Acqua Viva d'Inverno",
      location: "La Fontana di Pietra della Piazza",
      dateLabel: "4 dicembre",
      scripture: "«Chi berrà dell'acqua che io gli darò, non avrà mai più sete.» — Giovanni 4:14",
      reflection: "Anche nel gelo invernale, la fontana centenaria mormora al centro della piazza. Ci ricorda una sorgente inesauribile di vita che il freddo non può congelare.",
      activity: "Sostieni una mensa o una realtà che offre pasti caldi e riparo a chi non ha casa.",
      piazzaAwakening: "La fontana si illumina di riflessi cristallini e bagliori d'acqua.",
      goDeeperLabel: "Carità e accoglienza invernale"
    },
    5: {
      theme: "Il Profumo dell'Accoglienza",
      location: "Il Banco del Sidro Caldo",
      dateLabel: "5 dicembre",
      scripture: "«Non dimenticate l'ospitalità; alcuni hanno ospitato angeli senza saperlo.» — Ebrei 13:2",
      reflection: "Calderoni di sidro con chiodi di garofano e anice stellato sobbollono sulle braci. Accogliere un passante con una bevanda calda trasforma l'inverno in comunione.",
      activity: "Invita un amico o un vicino per un tè caldo e una conversazione sincera.",
      piazzaAwakening: "Il banco del sidro apre con tenda a righe rosse e calderoni fumanti.",
      goDeeperLabel: "L'ospitalità cristiana"
    },
    6: {
      theme: "Lo Spirito di San Nicola",
      location: "Il Carretto del Giocattolaio",
      dateLabel: "6 dicembre",
      scripture: "«Si è più beati nel dare che nel ricevere.» — Atti 20:35",
      reflection: "Nel giorno di San Nicola la generosità discreta consola i cuori. Donare con umiltà porta gioia senza pretendere applausi.",
      activity: "Fai un piccolo dono a sorpresa per un bambino o un collega.",
      piazzaAwakening: "Un carretto artigianale con schiaccianoci di legno appare nella piazza.",
      goDeeperLabel: "La vita di San Nicola"
    },
    7: {
      theme: "Il Canto dei Cori",
      location: "I Gradini della Cattedrale",
      dateLabel: "7 dicembre",
      scripture: "«Acclamate il Signore, abitanti di tutta la terra!» — Salmo 100:1",
      reflection: "Il suono del violino si leva nell'aria tersa. Voci concordi cantano inni antichi che scaldano le sere d'inverno.",
      activity: "Ascolta un inno d'Avvento e unisciti al canto con animo gioioso.",
      piazzaAwakening: "Il padiglione dei musici si illumina di lanterne a candela.",
      goDeeperLabel: "I canti della cattedrale"
    },
    8: {
      theme: "Il Rosone di Luce",
      location: "Il Rosone Gotico",
      dateLabel: "8 dicembre",
      scripture: "«La tua parola è una lampada al mio piede e una luce sul mio sentiero.» — Salmo 119:105",
      reflection: "La luce interiore risplende attraverso i vetri purpurei e zaffiro del rosone. Anche nella notte più fonda la verità risplende dal di dentro.",
      activity: "Dedica un momento alla lettura meditata di una pagina sacra.",
      piazzaAwakening: "Il rosone gotico brilla magnificamente di colori caldi.",
      goDeeperLabel: "I segreti del rosone"
    },
    9: {
      theme: "Il Chiostro della Pace",
      location: "Il Chiostro del Convento",
      dateLabel: "9 dicembre",
      scripture: "«Il Signore è il mio rifugio e la mia fortezza.» — Salmo 91:2",
      reflection: "Sotto le arcate silenziose, il chiostro protegge dal vento freddo. Trovare rifugio interiore è il dono prezioso dell'Avvento.",
      activity: "Prenditi un'ora senza notifiche o schermi per ritrovare la quiete interiore.",
      piazzaAwakening: "Lanterne di rame lungo il chiostro si accendono d'oro.",
      goDeeperLabel: "Silenzio e meditazione"
    },
    10: {
      theme: "La Lana Calda",
      location: "La Bottega del Tessitore",
      dateLabel: "10 dicembre",
      scripture: "«Rivestitevi di sentimenti di misericordia, di bontà e di umiltà.» — Colossesi 3:12",
      reflection: "Coperte pesanti tessute a mano riparano dal gelo. Ogni filo intrecciato rappresenta la cura reciproca.",
      activity: "Dona una coperta o un indumento caldo a chi ne ha bisogno.",
      piazzaAwakening: "Arazzi di lana calda decorano le finestre degli artigiani.",
      goDeeperLabel: "Solidarietà invernale"
    },
    11: {
      theme: "Il Grande Abete Sempreverde",
      location: "L'Albero Maestro della Piazza",
      dateLabel: "11 dicembre",
      scripture: "«Io sono come un cipresso sempreverde; da me viene il tuo frutto.» — Osea 14:8",
      reflection: "Sempre verde sotto la neve, l'abete testimonia la vita che non muore e la fedeltà della provvidenza.",
      activity: "Appendi una decorazione con un significato speciale e condividi il ricordo con i tuoi cari.",
      piazzaAwakening: "Il grande albero di Natale di quattro piani appare al centro della piazza.",
      goDeeperLabel: "Il simbolo dell'albero di Natale"
    },
    12: {
      theme: "Il Pan di Zenzero",
      location: "Il Banco dei Dolci Speziati",
      dateLabel: "12 dicembre",
      scripture: "«Come sono dolci le tue parole al mio palato, più del miele alla mia bocca!» — Salmo 119:103",
      reflection: "Miele, cannella e mandorle rendono l'attesa una festa condivisa di gioia e fraternità.",
      activity: "Prepara o regala dei biscotti speziati a qualcuno che si sente solo.",
      piazzaAwakening: "La bottega dei dolci si accende di ghirlande luminose.",
      goDeeperLabel: "Tradizioni natalizie in cucina"
    },
    13: {
      theme: "La Luce di Santa Lucia",
      location: "La Torre Campanaria",
      dateLabel: "13 dicembre",
      scripture: "«Voi siete la luce del mondo.» — Matteo 5:14",
      reflection: "Nella notte più buia dell'anno le candele vincono le tenebre, annunciando il ritorno della luce.",
      activity: "Compi un gesto gentile e premuroso verso qualcuno fin dal mattino.",
      piazzaAwakening: "Sulla terrazza della torre si accendono fiaccole luminose.",
      goDeeperLabel: "La festa di Santa Lucia"
    },
    14: {
      theme: "Le Lettere di Pace",
      location: "L'Ufficio Postale d'Epoca",
      dateLabel: "14 dicembre",
      scripture: "«Grazia a voi e pace da Dio nostro Padre.» — Filippesi 1:2",
      reflection: "Scrivere una lettera a mano custodisce i legami più preziosi al di là delle distanze.",
      activity: "Scrivi e spedisci una cartolina d'auguri scritta a mano a una persona lontana.",
      piazzaAwakening: "La storica buca delle lettere in ferro si illumina festosamente.",
      goDeeperLabel: "Pace e riconciliazione"
    },
    15: {
      theme: "L'Orologio della Piazza",
      location: "L'Orologio Astronomico",
      dateLabel: "15 dicembre",
      scripture: "«Per ogni cosa c'è il suo momento sotto il cielo.» — Ecclesiaste 3:1",
      reflection: "Il pendolo scandisce il tempo con passo fedele. L'Avvento ci insegna la saggezza dell'attesa.",
      activity: "Rimani 15 minuti in riposo contemplativo senza guardare le ore.",
      piazzaAwakening: "Il quadrante dell'orologio brilla di cifre dorate.",
      goDeeperLabel: "Il tempo dell'attesa"
    },
    16: {
      theme: "Il Portale Aperto",
      location: "Il Portale Maggiore del Duomo",
      dateLabel: "16 dicembre",
      scripture: "«Aprite le porte: entri la nazione giusta.» — Isaia 26:2",
      reflection: "I grandi battenti di quercia si aprono, lasciando trasparire il chiarore di cento candele.",
      activity: "Accogli con cuore largo chiunque varchi la tua soglia oggi.",
      piazzaAwakening: "Il portale della cattedrale si spalanca rivelando calda luce.",
      goDeeperLabel: "Accoglienza e preghiera"
    },
    17: {
      theme: "Il Lampione d'Oriente",
      location: "La Via Orientale",
      dateLabel: "17 dicembre",
      scripture: "«Guiderà i nostri passi sulla via della pace.» — Luca 1:79",
      reflection: "La luce cresce: un secondo lampione illumina i vicoli orientali tracciando una via sicura.",
      activity: "Offri il tuo ascolto a chi sta affrontando un momento di indecisione.",
      piazzaAwakening: "Il lampione orientale diffonde luce calda sui selciati.",
      goDeeperLabel: "Cammini di speranza"
    },
    18: {
      theme: "Il Grande Organo",
      location: "La Cantoria della Cattedrale",
      dateLabel: "18 dicembre",
      scripture: "«Lodatelo con strumenti a corda e con flauti!» — Salmo 150:4",
      reflection: "Le canne d'organo riempiono le navate di maestà solenne. L'armonia tocca le corde del cuore.",
      activity: "Ascolta un brano d'organo sacro per rinnovare la pace dello spirito.",
      piazzaAwakening: "Onde d'oro sonore risuonano dalla cattedrale.",
      goDeeperLabel: "La musica d'organo sacra"
    },
    19: {
      theme: "Le Luci sull'Albero",
      location: "I Rami del Grande Abete",
      dateLabel: "19 dicembre",
      scripture: "«In lui era la vita, e la vita era la luce degli uomini.» — Giovanni 1:4",
      reflection: "Mille piccole luci scintillano tra i rami sempreverdi: unite vincono ogni notte.",
      activity: "Esprimi gratitudine per un gesto generoso che hai notato oggi.",
      piazzaAwakening: "48 ghirlande luminose si accendono sull'abete.",
      goDeeperLabel: "Luce e vita"
    },
    20: {
      theme: "Il Presepe di Legno",
      location: "La Bottega dell'Intagliatore",
      dateLabel: "20 dicembre",
      scripture: "«Troverete un bambino avvolto in fasce, adagiato in una mangiatoia.» — Luca 2:12",
      reflection: "Figure intagliate nel legno d'olivo: nella povertà della grotta risplende il mistero divino.",
      activity: "Sosta in preghiera davanti al presepe contemplando la bellezza dell'umiltà.",
      piazzaAwakening: "La bottega dei presepi si illumina di candele soffuse.",
      goDeeperLabel: "San Francesco e il presepe di Greccio"
    },
    21: {
      theme: "Il Solstizio d'Inverno",
      location: "Il Belvedere della Piazza",
      dateLabel: "21 dicembre",
      scripture: "«La luce splende nelle tenebre e le tenebre non l'hanno sopraffatta.» — Giovanni 1:5",
      reflection: "Nella notte più lunga il sole ricomincia il suo cammino ascendente. La speranza rinasce.",
      activity: "Accendi una luce in casa a testimonianza della rinascita interiore.",
      piazzaAwakening: "Raggi di luce celeste scendono sulla piazza innevata.",
      goDeeperLabel: "La vittoria della luce"
    },
    22: {
      theme: "La Corona della Pace",
      location: "L'Atrio della Cattedrale",
      dateLabel: "22 dicembre",
      scripture: "«La pace di Dio, che supera ogni intelligenza, custodirà i vostri cuori.» — Filippesi 4:7",
      reflection: "Le quattro candele dell'Avvento risplendono piene di grazia. La pace è il dono più atteso.",
      activity: "Fai il primo passo per perdonare o chiedere riconciliazione.",
      piazzaAwakening: "Le quattro grandi candele dell'atrio risplendono maestose.",
      goDeeperLabel: "Operatori di pace"
    },
    23: {
      theme: "Il Cielo di Festoni",
      location: "I Festoni Luminosi",
      dateLabel: "23 dicembre",
      scripture: "«Alza gli occhi intorno e guarda!» — Isaia 60:4",
      reflection: "Un tetto di stelle luminose brilla sopra le teste dei passanti. L'attesa è quasi compiuta.",
      activity: "Concludi con serenità e letizia i preparativi della vigilia.",
      piazzaAwakening: "Un baldacchino di festoni scintillanti ricopre l'intera piazza.",
      goDeeperLabel: "Veglia di Natale"
    },
    24: {
      theme: "La Stella di Betlemme",
      location: "La Cima dell'Abete",
      dateLabel: "24 dicembre",
      scripture: "«Ed ecco, la stella che avevano visto a oriente li precedeva.» — Matteo 2:9",
      reflection: "Sulla cima dell'abete la Stella brilla inondando la piazza d'oro. Il cammino si compie in letizia, comunione e benedizione.",
      activity: "Radunati con i tuoi cari per condividere la gioia del Santo Natale.",
      piazzaAwakening: "La Stella di Betlemme brilla sulla cima dell'albero inondando la piazza di luce dorata.",
      goDeeperLabel: "La Notte Santa"
    }
  },
  pt: {
    1: {
      theme: "A Luz no Pátio",
      location: "O Lampião a Gás do Arco Norte",
      dateLabel: "1 de dezembro",
      scripture: "«O povo que andava nas trevas viu uma grande luz.» — Isaías 9:2",
      reflection: "Ao descer o crepúsculo de inverno sobre os arcos de pedra, acende-se uma única lâmpada. O Advento começa com uma chama paciente e serena.",
      activity: "Acenda uma vela na sua janela esta noite e envie uma palavra de encorajamento a quem precisa.",
      piazzaAwakening: "O lampião a gás da rua norte acende-se, iluminando a calçada com tons dourados.",
      goDeeperLabel: "A coroa do Advento"
    },
    2: {
      theme: "Calor do Forno",
      location: "A Padaria da Aldeia Velha",
      dateLabel: "2 de dezembro",
      scripture: "«O pão nosso de cada dia nos dai hoje.» — Mateus 6:11",
      reflection: "Da padaria da esquina sai o aroma a pão fresco e canela. Partilhar o pão é o sinal mais sagrado de comunhão.",
      activity: "Ofereça um pão fresco ou bolo a um vizinho ou cuidador na sua comunidade.",
      piazzaAwakening: "A padaria ilumina-se com luz âmbar e suave fumo na chaminé.",
      goDeeperLabel: "Comunidade e partilha"
    },
    3: {
      theme: "A Neve que Sussurra",
      location: "As Ruas de Calçada",
      dateLabel: "3 de dezembro",
      scripture: "«Aquietai-vos e sabei que eu sou Deus.» — Salmo 46:10",
      reflection: "O silêncio cobre os telhados enquanto a neve cai suavemente. No sossego do inverno encontramos espaço para escutar a paz.",
      activity: "Faça um passeio de dez minutos em silêncio agradecendo por cinco bênçãos da sua vida.",
      piazzaAwakening: "Neve suave em 3D cobre os telhados e vielas da praça.",
      goDeeperLabel: "Recolhimento interior"
    },
    4: {
      theme: "Água Viva no Inverno",
      location: "A Fonte de Pedra da Praça",
      dateLabel: "4 de dezembro",
      scripture: "«Aquele que beber da água que eu lhe der nunca mais terá sede.» — João 4:14",
      reflection: "Mesmo no frio mais rigoroso, a fonte antiga murmura na praça. Lembra-nos a fonte inesgotável de vida que nunca seca.",
      activity: "Apoie uma instituição que ofereça abrigo e comida quente a quem não tem teto.",
      piazzaAwakening: "A fonte ilumina-se com reflexos cristalinos de gelo e água.",
      goDeeperLabel: "Solidariedade no inverno"
    },
    5: {
      theme: "O Aroma da Hospitalidade",
      location: "A Barraca de Cidra Especiada",
      dateLabel: "5 de dezembro",
      scripture: "«Não vos esqueçais da hospitalidade, porque por ela alguns hospedaram anjos.» — Hebreus 13:2",
      reflection: "Caldeirões de cidra de maçã com cravinho e canela fumegam sobre as brasas. Acolher com calor humano transforma o inverno.",
      activity: "Convide um amigo ou vizinho para um chá quente e uma boa conversa.",
      piazzaAwakening: "A barraca de cidra abre com toldo vermelho e caldeirões reluzentes.",
      goDeeperLabel: "Praticar a hospitalidade"
    },
    6: {
      theme: "O Espírito de São Nicolau",
      location: "A Carroça do Brinquedeiro",
      dateLabel: "6 de dezembro",
      scripture: "«Mais bem-aventurada coisa é dar do que receber.» — Atos 20:35",
      reflection: "No dia de São Nicolau, a generosidade discreta alegra os corações sem buscar aplausos.",
      activity: "Deixe um pequeno presente ou surpresa anónima para uma criança ou colega.",
      piazzaAwakening: "A carroça de quebra-nozes de madeira aparece na praça.",
      goDeeperLabel: "A vida de São Nicolau"
    },
    7: {
      theme: "A Melodia dos Coros",
      location: "A Escadaria da Sé",
      dateLabel: "7 de dezembro",
      scripture: "«Celebrai com júbilo ao Senhor, todas as terras!» — Salmo 100:1",
      reflection: "O violino eleva-se no ar fresco. Cantores entoam melodias que atravessam séculos de esperança.",
      activity: "Ouça um hino tradicional de Natal e cante com o coração alegre.",
      piazzaAwakening: "O coreto dos coristas ilumina-se com lanternas de velas.",
      goDeeperLabel: "Música sacra coral"
    },
    8: {
      theme: "A Rosácea da Sé",
      location: "A Rosácea Gótica",
      dateLabel: "8 de dezembro",
      scripture: "«Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.» — Salmo 119:105",
      reflection: "A luz interior atravessa os vitrais rubros e azuis da rosácea. A beleza da verdade brilha na noite.",
      activity: "Dedique momentos de serenidade à leitura de um texto sagrado.",
      piazzaAwakening: "A rosácea gótica ilumina-se com reflexos coloridos.",
      goDeeperLabel: "Simbolismo dos vitrais"
    },
    9: {
      theme: "O Refúgio do Claustro",
      location: "O Claustro do Mosteiro",
      dateLabel: "9 de dezembro",
      scripture: "«O Senhor é o meu refúgio e a minha fortaleza.» — Salmo 91:2",
      reflection: "Entre arcos antigos, o claustro guarda do vento gelado. Encontrar paz interior é a vocação do Advento.",
      activity: "Desligue os ecrãs durante uma hora para desfrutar da calma interior.",
      piazzaAwakening: "Lampiões de cobre acendem-se ao longo do claustro.",
      goDeeperLabel: "Oração e serenidade"
    },
    10: {
      theme: "O Tear da Fraternidade",
      location: "A Oficina do Tecelão",
      dateLabel: "10 de dezembro",
      scripture: "«Revesti-vos de entranhas de misericórdia, de benignidade e de humildade.» — Colossenses 3:12",
      reflection: "Mantas grossas tecidas à mão protegem do frio. Cada fio entrelaçado é um gesto de cuidado e afeto.",
      activity: "Doe roupas de abrigo a quem mais precisa neste inverno.",
      piazzaAwakening: "Bandeiras de lã festivas enfeitam as janelas da guilda.",
      goDeeperLabel: "Apoio aos desabrigados"
    },
    11: {
      theme: "O Grande Pinheiro de Natal",
      location: "O Pinheiro da Praça",
      dateLabel: "11 de dezembro",
      scripture: "«Eu sou como o cipreste verde; de mim é achado o teu fruto.» — Oseias 14:8",
      reflection: "Verde sob a neve, o pinheiro testemunha a vida indefectível e a fidelidade da graça divina.",
      activity: "Coloque um enfeite especial na sua árvore e partilhe o seu significado em família.",
      piazzaAwakening: "O grande pinheiro de Natal de 4 andares surge no coração da praça.",
      goDeeperLabel: "A árvore de Natal"
    },
    12: {
      theme: "O Pão de Mel Especiado",
      location: "A Barraca de Lebkuchen",
      dateLabel: "12 de dezembro",
      scripture: "«Quão doces são as tuas palavras ao meu paladar! Mais do que o mel à minha boca.» — Salmo 119:103",
      reflection: "Mel, amêndoas e especiarias adoçam os dias de expectativa num espírito de generosidade.",
      activity: "Faça biscoitos caseiros e partilhe-os com quem precisa de carinho.",
      piazzaAwakening: "A barraca de doces abre com iluminação acolhedora.",
      goDeeperLabel: "Doces de Natal tradicionais"
    },
    13: {
      theme: "A Claridade de Santa Luzia",
      location: "A Torre Sineira",
      dateLabel: "13 de dezembro",
      scripture: "«Vós sois a luz do mundo.» — Mateus 5:14",
      reflection: "Nas noites mais longas do ano, a luz das velas vence as trevas com ternura e esperança.",
      activity: "Faça um gesto generoso logo pela manhã em favor de alguém ao seu redor.",
      piazzaAwakening: "Tochas acendem-se no terraço da torre sineira.",
      goDeeperLabel: "A festa de Santa Luzia"
    },
    14: {
      theme: "Cartas de Amizade",
      location: "O Correio Antigo",
      dateLabel: "14 de dezembro",
      scripture: "«Graça a vós e paz da parte de Deus nosso Pai.» — Filipenses 1:2",
      reflection: "Palavras escritas à mão renovam os laços que a distância não consegue apagar.",
      activity: "Envie um postal de Natal escrito à mão a um amigo ou familiar distante.",
      piazzaAwakening: "O marco de correio histórico ilumina-se com lanternas natalícias.",
      goDeeperLabel: "Reconciliação e paz"
    },
    15: {
      theme: "O Relógio da Torre",
      location: "O Relógio Astronómico",
      dateLabel: "15 de dezembro",
      scripture: "«Tudo tem o seu tempo determinado debaixo do céu.» — Eclesiastes 3:1",
      reflection: "O tempo corre com serenidade. O Advento ensina a paciência de esperar com esperança viva.",
      activity: "Descanse quinze minutos em silêncio contemplativo sem olhar para as horas.",
      piazzaAwakening: "Os numerais dourados do relógio astronómico brilham na noite.",
      goDeeperLabel: "O tempo sagrado"
    },
    16: {
      theme: "O Grande Pórtico Aberto",
      location: "O Portal Maior da Sé",
      dateLabel: "16 de dezembro",
      scripture: "«Abri as portas para que entre a nação justa.» — Isaías 26:2",
      reflection: "As pesadas portas de carvalho abrem-se de par em par, revelando a luz cálida de centenas de velas.",
      activity: "Receba com carinho e alegria qualquer pessoa que venha ao seu encontro hoje.",
      piazzaAwakening: "O portal da Sé abre-se acolhendo a todos na sua claridade.",
      goDeeperLabel: "Portas abertas"
    },
    17: {
      theme: "O Lampião do Oriente",
      location: "A Rua do Oriente",
      dateLabel: "17 de dezembro",
      scripture: "«Para guiar os nossos pés pelo caminho da paz.» — Lucas 1:79",
      reflection: "A luz expande-se pelas ruelas. O segundo lampião traça um trilho seguro na noite de inverno.",
      activity: "Apoie quem estiver a passar por um momento de indecisão ou incerteza.",
      piazzaAwakening: "O lampião a gás oriental ilumina o caminho com luz dourada.",
      goDeeperLabel: "Caminhos de paz"
    },
    18: {
      theme: "O Órgão da Sé",
      location: "O Coro Alto",
      dateLabel: "18 de dezembro",
      scripture: "«Louvai-o com instrumentos de cordas e com flautas!» — Salmo 150:4",
      reflection: "Os tubos de estanho enchem o templo de harmonia grandiosa. A música expressa o que as palavras não alcançam.",
      activity: "Escute uma peça de órgão sacro e alimente a paz da sua alma.",
      piazzaAwakening: "Ressonâncias douradas ecoam da torre da igreja.",
      goDeeperLabel: "A música de órgão na liturgia"
    },
    19: {
      theme: "Luzes no Pinheiro",
      location: "Os Ramos do Grande Pinheiro",
      dateLabel: "19 de dezembro",
      scripture: "«Nele estava a vida, e a vida era a luz dos homens.» — João 1:4",
      reflection: "Pequenas luzes cintilam entre as agulhas verdes: unidas, dissipam qualquer escuridão.",
      activity: "Elogie com sinceridade um gesto nobre feito por alguém próximo de si.",
      piazzaAwakening: "48 cordões de luzes de fada acendem-se no pinheiro de Natal.",
      goDeeperLabel: "Luz e vida"
    },
    20: {
      theme: "O Presépio de Oliveira",
      location: "A Oficina do Escultor",
      dateLabel: "20 de dezembro",
      scripture: "«Achareis o menino envolto em panos e deitado numa manjedoura.» — Lucas 2:12",
      reflection: "Figuras simples de madeira de oliveira: na extrema simplicidade repousa o amor infinito.",
      activity: "Reze ou contemple o presépio no seu lar meditando sobre a humildade.",
      piazzaAwakening: "A barraca de presépios artesanais ilumina-se suavemente.",
      goDeeperLabel: "São Francisco e o presépio"
    },
    21: {
      theme: "O Solstício de Inverno",
      location: "O Miradouro da Praça",
      dateLabel: "21 de dezembro",
      scripture: "«A luz resplandece nas trevas, e as trevas não a compreenderam.» — João 1:5",
      reflection: "Na noite mais longa do ano, o ciclo inverte-se e a luz volta a crescer. A esperança triunfa sempre.",
      activity: "Acenda mais uma vela no seu lar em sinal de renovação e fé.",
      piazzaAwakening: "Raios de luz celestial tocam com serenidade a praça coberta de neve.",
      goDeeperLabel: "O triunfo da luz"
    },
    22: {
      theme: "A Coroa da Paz",
      location: "O Átrio da Sé",
      dateLabel: "22 de dezembro",
      scripture: "«A paz de Deus, que excede todo o entendimento, guardará os vossos corações.» — Filipenses 4:7",
      reflection: "As quatro velas da coroa ardem em esplendor. A paz é o dom maior para os nossos corações.",
      activity: "Perdoe ou peça perdão para selar uma reconciliação fraterna.",
      piazzaAwakening: "As quatro velas monumentais do átrio brilham em plenitude.",
      goDeeperLabel: "Construtores da paz"
    },
    23: {
      theme: "O Céu de Festões",
      location: "Os Festões da Praça",
      dateLabel: "23 de dezembro",
      scripture: "«Levanta em redor os teus olhos e olha!» — Isaías 60:4",
      reflection: "Grinaldas de luz suspensas criam um firmamento dourado sobre as pessoas. A espera está quase a terminar.",
      activity: "Termine os preparativos da véspera de Natal com serenidade e afeto.",
      piazzaAwakening: "O dossel de festões luminosos ilumina a praça inteira como um céu de estrelas.",
      goDeeperLabel: "Véspera de Natal"
    },
    24: {
      theme: "A Estrela de Belém",
      location: "O Cimo do Pinheiro",
      dateLabel: "24 de dezembro",
      scripture: "«E eis que a estrela que tinham visto no oriente ia adiante deles.» — Mateus 2:9",
      reflection: "No topo do pinheiro a Estrela de Belém brilha intensamente, enchendo a praça de júbilo e bênção. A caminhada do Advento cumpre-se em luz, amor e paz.",
      activity: "Reúna-se com os seus familiares e celebre a Noite Santa de Natal.",
      piazzaAwakening: "A Estrela de Belém ilumina a cumeeira da árvore, inundando a praça de resplendor dourado.",
      goDeeperLabel: "A Noite de Natal"
    }
  }
};
