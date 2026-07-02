import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const testimonials = [
  // On Hill Sport
  {
    brandName: "On Hill Sport",
    authorName: "Dmitry Volkov",
    authorRole: "Marketing Director",
    rating: 5,
    testimonials: {
      en: "Isaac brought authentic energy to our brand. His audience engagement was exceptional.",
      ru: "Исаак привнес аутентичную энергию в наш бренд. Вовлеченность его аудитории была исключительной.",
      fr: "Isaac a apporté une énergie authentique à notre marque. L'engagement de son audience a été exceptionnel.",
      es: "Isaac aportó una energía auténtica a nuestra marca. La participación de su audiencia fue excepcional.",
      ar: "أضاف Isaac طاقة حقيقية إلى علامتنا التجارية. كان تفاعل جمهوره استثنائيًا.",
    },
  },
  // Keybell
  {
    brandName: "Keybell",
    authorName: "Elena Sokolov",
    authorRole: "CEO",
    rating: 5,
    testimonials: {
      en: "Collaborating with Isaac was a turning point. His followers are exactly our target audience.",
      ru: "Сотрудничество с Исааком было переломным моментом. Его подписчики - это именно наша целевая аудитория.",
      fr: "Collaborer avec Isaac a été un tournant. Ses abonnés correspondent exactement à notre audience cible.",
      es: "Colaborar con Isaac fue un punto de inflexión. Sus seguidores son exactamente nuestro público objetivo.",
      ar: "كان التعاون مع Isaac نقطة تحول. متابعوه هم بالضبط جمهورنا المستهدف.",
    },
  },
  // Reboot
  {
    brandName: "Reboot",
    authorName: "Евгения",
    authorRole: "PR-менеджер, Reboot",
    rating: 5,
    testimonials: {
      en: "You are already at the level where you can lead personal training sessions. The marketing team is waiting for you with a gift at the Barrikadnaya studio.",
      ru: "Ты уже на уровне, где можешь проводить персональные тренировки. Команда маркетинга ждёт тебя с подарком в студии на Баррикадной.",
      fr: "Tu es déjà au niveau où tu peux animer des séances d'entraînement personnelles. L'équipe marketing t'attend avec un cadeau au studio de Barrikadnaya.",
      es: "Ya estás en el nivel en el que puedes dirigir sesiones de entrenamiento personal. El equipo de marketing te espera con un regalo en el estudio de Barrikadnaya.",
      ar: "لقد وصلت بالفعل إلى المستوى الذي يمكنك فيه تقديم جلسات تدريب شخصية. فريق التسويق ينتظرك بهدية في استوديو Barrikadnaya.",
    },
  },
];

async function seedTestimonials() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    // Delete existing testimonials
    await connection.execute("DELETE FROM testimonials");
    console.log("✓ Cleared existing testimonials");

    // Insert new testimonials
    for (const item of testimonials) {
      for (const [lang, quote] of Object.entries(item.testimonials)) {
        await connection.execute(
          "INSERT INTO testimonials (brandName, authorName, authorRole, quote, rating, language, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [item.brandName, item.authorName, item.authorRole, quote, item.rating, lang, 1]
        );
      }
    }

    console.log("✓ Testimonials seeded successfully");
    const [rows] = await connection.execute(
      "SELECT language, COUNT(*) as count FROM testimonials GROUP BY language"
    );
    console.log("Testimonials per language:", rows);
  } catch (error) {
    console.error("Error seeding testimonials:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seedTestimonials();
