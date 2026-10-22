// Translations of the exact English testimonials already published in the Media Kit.
// Matching the source quote prevents a changed testimonial receiving an unrelated translation.
const armenianQuotes: Record<string, { quote: string; authorRole: string }> = {
  "Isaac brought authentic energy to our brand. His audience engagement was exceptional.":
    {
      quote:
        "Իսահակը մեր բրենդին բնական ու անկեղծ էներգիա հաղորդեց։ Նրա լսարանի ակտիվ արձագանքը բացառիկ էր։",
      authorRole: "Մարքեթինգի տնօրեն",
    },
  "Collaborating with Isaac was a turning point. His followers are exactly our target audience.":
    {
      quote:
        "Իսահակի հետ համագործակցությունը շրջադարձային էր։ Նրա հետևորդները հենց այն լսարանն են, որին մենք ուզում ենք հասնել։",
      authorRole: "Գործադիր տնօրեն",
    },
  "You are already at the level where you can lead personal training sessions. The marketing team is waiting for you with a gift at the Barrikadnaya studio.":
    {
      quote:
        "Դուք արդեն այն մակարդակին եք, որ կարող եք անհատական մարզումներ վարել։ Մարքեթինգի թիմը ձեզ նվերով սպասում է Բարիկադնայայի ստուդիայում։",
      authorRole: "Հանրային կապերի պատասխանատու, Reboot",
    },
};

export function localizeTestimonial<
  T extends { quote: string; authorRole: string | null; language: string },
>(item: T, language: string): T {
  if (language !== "hy" || item.language !== "en") return item;
  const translated = armenianQuotes[item.quote];
  return translated ? { ...item, ...translated, language: "hy" } : item;
}
