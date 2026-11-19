import { Link } from 'react-router-dom';
import { PageHero, Section } from '../components/ui/Section';
import { WaButton } from '../components/ui/WaButton';
import { MESSAGES } from '../lib/whatsapp';
import { ZONES, PENDING } from '../data/site';
import { useUi } from '../context/UiContext';

function ZonesTable({ ids }: { ids: string[] }) {
  return (
    <div id="pays" className="scroll-mt-32 overflow-x-auto rounded-2xl border border-gold/15">
      <table className="w-full min-w-[28rem] text-left text-sm">
        <caption className="sr-only">Pays desservis par zone</caption>
        <thead className="bg-ink-3 text-ivory"><tr><th className="p-4 font-medium">Zone</th><th className="p-4 font-medium">Pays</th></tr></thead>
        <tbody className="divide-y divide-gold/10 text-ivory-2">
          {ZONES.filter((z) => ids.includes(z.id)).map((z) => (
            <tr key={z.id}><td className="p-4 text-ivory">{z.label}</td><td className="p-4">{z.countries.join(', ')}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AbroadPage() {
  return (
    <>
      <PageHero eyebrow="Diaspora" title="Commander depuis l’étranger" crumbs={[{ label: 'Commander depuis l’étranger' }]}>
        <p>Vous vivez en France, en Italie, en Espagne, aux États-Unis ou ailleurs. Vous commandez pour vous, ou pour une femme restée au pays. Voici comment cela se passe.</p>
      </PageHero>
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <article className="card p-8">
            <h2 className="font-serif text-3xl">Vous connaissez déjà ces maisons</h2>
            <div className="body-copy mt-4">
              <p>Empreinte, Elomi, Louisa Bracq. Si vous avez vécu en Europe, ces noms ne vous sont pas inconnus et vous savez ce qu’ils valent.</p>
              <p>Ce que vous ne trouviez pas, c’est quelqu’un pour vous mesurer en français, vous répondre sur WhatsApp à toute heure, et comprendre ce que vous cherchez sans que vous ayez à l’expliquer deux fois.</p>
            </div>
            <Link to="/maisons" className="btn-line mt-6">Découvrir les maisons</Link>
          </article>
          <article className="card p-8">
            <h2 className="font-serif text-3xl">Offrir à une femme restée au pays</h2>
            <div className="body-copy mt-4">
              <p>Vous payez d’où vous êtes, nous livrons chez elle. L’adresse de livraison est différente de la vôtre, et le prix n’apparaît nulle part sur le colis.</p>
              <p>Vous pouvez joindre un message. Nous vous prévenons par WhatsApp quand elle l’a reçu.</p>
              <p>Le colis est neutre : rien à l’extérieur n’indique ce qu’il contient, ni d’où il vient.</p>
            </div>
            <Link to="/boutique" className="btn-gold mt-6">Commander pour quelqu’un d’autre</Link>
            <p className="mt-3 text-sm text-mute">Cochez « Commande à offrir » dans votre panier.</p>
          </article>
          <article className="card p-8">
            <h2 className="font-serif text-3xl">Vous rentrez bientôt ?</h2>
            <div className="body-copy mt-4">
              <p>Commandez dès maintenant, nous gardons tout en boutique jusqu’à votre passage. Vous essayez sur place, vous échangez si besoin, et vous repartez avec.</p>
              <p>Dites-nous simplement vos dates.</p>
            </div>
            <WaButton message="Bonjour Chambre 69, je rentre bientôt à Dakar et je souhaite réserver des pièces pour mon séjour. Mes dates : " source="diaspora-sejour" variant="line" className="mt-6">Réserver pour mon séjour</WaButton>
          </article>
          <article className="card p-8">
            <h2 className="font-serif text-3xl">Ce qu’il faut savoir</h2>
            <div className="body-copy mt-4">
              <p>Les frais et le délai de livraison se règlent avec votre conseillère, sur WhatsApp ou par téléphone, avant de valider quoi que ce soit.</p>
              <p>Le règlement est convenu avec votre conseillère, et le libellé qui apparaît sur votre relevé est discret.</p>
              <p>Selon votre pays, des droits de douane peuvent s’appliquer à la réception. Nous vous l’indiquons avant la commande, jamais après.</p>
              <p>Notre numéro WhatsApp fonctionne depuis l’étranger, comme un numéro ordinaire.</p>
            </div>
            <a href="#pays" className="btn-gold mt-6">Voir les pays desservis</a>
          </article>
        </div>
      </Section>
      <Section tone="ink2">
        <h2 className="h-section mb-8">Où nous livrons</h2>
        <ZonesTable ids={['international', 'dakar', 'senegal']} />
        <p className="mt-6 max-w-prose text-sm text-mute">Les frais et le délai de livraison se règlent directement avec votre conseillère, sur WhatsApp ou par téléphone, avant toute validation. Rien n’est expédié sans votre accord.</p>
        <WaButton message={MESSAGES.abroad()} source="diaspora-bas" className="mt-8">Parler à une conseillère</WaButton>
      </Section>
    </>
  );
}

export function WestAfricaPage() {
  const { openSizeGuide } = useUi();
  return (
    <>
      <PageHero eyebrow="Afrique de l’Ouest" title="Nous livrons en Afrique de l’Ouest" crumbs={[{ label: 'Afrique de l’Ouest' }]}>
        <p>Côte d’Ivoire, Mali, Burkina Faso, Guinée, Mauritanie, Gambie, Bénin, Togo. Si vous ne trouvez pas votre taille chez vous, nous l’avons probablement.</p>
      </PageHero>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <article>
            <h2 className="h-section">Pourquoi commander chez nous</h2>
            <ul className="mt-6 space-y-4 text-[17px] text-ivory-2">
              <li className="border-l border-gold/50 pl-5">Parce que nous montons jusqu’au bonnet O, et que cette amplitude est introuvable dans la plupart des villes de la région.</li>
              <li className="border-l border-gold/50 pl-5">Parce que nous importons directement d’Europe : ce sont des pièces authentiques, pas des copies.</li>
              <li className="border-l border-gold/50 pl-5">Parce qu’une conseillère vous répond sur WhatsApp, vous aide à prendre vos mesures, et vous dit honnêtement si nous avons ce qu’il vous faut.</li>
              <li className="border-l border-gold/50 pl-5">Et parce que nous proposons des brassières post-opératoires et des prothèses mammaires, que presque personne ne propose dans la sous-région. <Link to="/apres-mastectomie" className="text-gold hover:underline">En savoir plus</Link></li>
            </ul>
          </article>
          <article>
            <h2 className="h-section">Comment ça se passe</h2>
            <ol className="mt-6 space-y-4 text-[17px] text-ivory-2">
              {['Vous indiquez votre pays : votre conseillère convient avec vous, sur WhatsApp ou par téléphone, des frais et du délai.', 'Vous réglez selon les modalités convenues avec votre conseillère.', PENDING.shipDays ? `Nous expédions sous ${PENDING.shipDays} jours ouvrés, dans un colis neutre, et vous suivez votre commande.` : 'Nous expédions dès votre accord, dans un colis neutre, et vous suivez votre commande sur WhatsApp.', 'Si la taille ne va pas, écrivez-nous : nous trouverons une solution.'].map((t, i) => (
                <li key={t} className="flex gap-4"><span className="font-serif text-3xl leading-none text-gold">{i + 1}</span><span>{t}</span></li>
              ))}
            </ol>
            <a href="#pays" className="btn-gold mt-8">Voir les pays desservis</a>
          </article>
        </div>
      </Section>
      <Section tone="ink2">
        <div className="grid gap-10 lg:grid-cols-2">
          <article>
            <h2 className="font-serif text-3xl">Vous n’êtes pas sûre de votre taille ?</h2>
            <div className="body-copy mt-4">
              <p>C’est la question que l’on nous pose le plus souvent, et c’est normal : personne ne vous a jamais mesurée.</p>
              <p>Notre outil vous donne un point de départ en deux minutes. Ensuite, une conseillère vérifie avec vous sur WhatsApp, avant que vous ne commandiez. Cela ne coûte rien et cela évite un échange à distance.</p>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="btn-gold" onClick={() => openSizeGuide('afrique-ouest')}>Trouver ma taille</button>
              <WaButton message={MESSAGES.sizeCheck()} source="afrique-ouest-taille" variant="line">Faire vérifier sur WhatsApp</WaButton>
            </div>
          </article>
          <article>
            <h2 className="font-serif text-3xl">Un héritage que nous partageons</h2>
            <div className="body-copy mt-4">
              <p>Notre collection traditionnelle est née au Sénégal, mais l’art dont elle vient se retrouve dans toute la région, sous d’autres noms.</p>
              <p>Si vous nous écrivez d’Abidjan, de Bamako ou de Conakry, dites-nous ce qui se transmet chez vous. Nous comptons élargir cette collection, et nous préférons le faire avec vous.</p>
            </div>
            <Link to="/heritage" className="btn-line mt-6">Découvrir la collection</Link>
          </article>
        </div>
      </Section>
      <Section>
        <h2 className="h-section mb-8">Les pays que nous livrons</h2>
        <ZonesTable ids={['sous-region']} />
        <p className="mt-6 max-w-prose text-sm text-mute">Les frais et le délai de livraison se règlent directement avec votre conseillère, sur WhatsApp ou par téléphone, avant toute validation. Rien n’est expédié sans votre accord.</p>
      </Section>
    </>
  );
}
