/** Articles de L'École du bon maintien — textes du livrable rédactionnel, partie 2.5. */
export type Article = {
  slug: string;
  title: string;
  lead: string;
  metaDescription: string;
  sections: { h: string; p: string[] }[];
  outro?: { h: string; p: string[] };
  cta: { label: string; to: string };
};

export const ARTICLES: Article[] = [
  {
    slug: 'soutien-gorge-a-votre-taille',
    title: 'Cinq signes que votre soutien-gorge n’est pas à votre taille',
    lead: 'Aucun de ces signes ne vient de votre corps. Ils viennent tous du vêtement.',
    metaDescription: 'Bande qui remonte, bretelles qui marquent, armature qui blesse : cinq signes que votre soutien-gorge n’est pas à votre taille, et comment choisir le bon.',
    sections: [
      { h: '1. La bande remonte dans le dos', p: ['C’est le signe le plus fréquent et le plus révélateur. La bande doit rester horizontale et fournir l’essentiel du maintien. Si elle remonte, elle est trop large : descendez d’un tour de dos et montez d’un bonnet.'] },
      { h: '2. Les bretelles creusent les épaules', p: ['Les bretelles ne doivent assurer qu’une petite part du maintien. Si elles marquent, c’est que la bande ne fait pas son travail.'] },
      { h: '3. L’armature s’appuie sur la poitrine', p: ['L’armature doit se poser sur la cage thoracique, en suivant le sillon naturel. Si elle repose sur le sein, le bonnet est trop petit, même si vous êtes à l’aise.'] },
      { h: '4. Le bonnet fait un pli, ou déborde', p: ['Un bonnet qui plisse est trop grand. Un bonnet qui déborde sur le côté ou sur le dessus est trop petit. Dans les deux cas, ce n’est pas votre poitrine qui est mal faite.'] },
      { h: '5. Vous le réajustez toute la journée', p: ['Un soutien-gorge à la bonne taille se porte sans y penser. Si vous y pensez, c’est qu’il y a une raison.'] },
    ],
    outro: { h: 'Ce qu’il faut retenir', p: ['On change de taille plusieurs fois dans une vie : après une grossesse, après une variation de poids, à la ménopause, ou simplement en vieillissant. Une mesure tous les deux ans est une bonne habitude.'] },
    cta: { label: 'Trouver ma taille en deux minutes', to: '/guide-des-tailles' },
  },
  {
    slug: 'prendre-soin-de-sa-lingerie',
    title: 'Faire durer sa lingerie : ce qui change tout',
    lead: 'Une belle pièce coûte plus cher. Bien entretenue, elle dure trois à quatre fois plus longtemps qu’une pièce d’entrée de gamme. C’est là que se fait la vraie économie.',
    metaDescription: 'Lavage à la main, séchage à l’ombre, rangement des bonnets moulés : les gestes simples pour faire durer votre lingerie trois à quatre fois plus longtemps.',
    sections: [
      { h: 'Lavez à la main, à l’eau froide', p: ['La chaleur détend l’élasthanne, qui est ce qui fait tenir un soutien-gorge. Dix minutes dans une bassine d’eau froide avec un savon doux suffisent.'] },
      { h: 'Ne tordez jamais', p: ['Pressez entre les paumes, puis roulez dans une serviette. Tordre déforme les bonnets de façon irréversible.'] },
      { h: 'Séchez à plat, à l’ombre', p: ['Le soleil direct décolore les teintes profondes et fragilise les dentelles en quelques semaines. Séchez à l’intérieur ou sous un abri.'] },
      { h: 'Rangez sans plier les bonnets', p: ['Un bonnet moulé plié perd sa forme. Rangez les pièces les unes derrière les autres, jamais l’une dans l’autre.'] },
      { h: 'Alternez', p: ['Un soutien-gorge a besoin de vingt-quatre heures pour retrouver son élasticité. Trois pièces portées en alternance durent plus longtemps que trois pièces portées à la suite.'] },
    ],
    cta: { label: 'Découvrir la collection', to: '/boutique' },
  },
  {
    slug: 'rendez-vous-prise-de-mesures',
    title: 'Ce qui se passe pendant une prise de mesures',
    lead: 'Beaucoup de femmes n’osent pas franchir la porte, par pudeur ou parce qu’elles imaginent quelque chose de désagréable. Voici exactement comment cela se déroule.',
    metaDescription: 'Gratuit, vingt minutes, en salon fermé, sans commentaire sur votre corps : voici exactement comment se déroule une prise de mesures chez Chambre 69 à Dakar.',
    sections: [
      { h: 'C’est gratuit et sans obligation d’achat', p: ['Vous pouvez repartir sans rien. Cela arrive tous les jours, et personne ne vous fera sentir quoi que ce soit.'] },
      { h: 'Cela dure vingt minutes', p: ['Une conseillère vous reçoit dans un salon fermé. Vous n’êtes jamais dans un espace ouvert.'] },
      { h: 'Vous restez habillée si vous le souhaitez', p: ['La mesure peut se prendre par-dessus un vêtement fin. Vous décidez de ce que vous êtes prête à faire, et personne ne vous demande davantage.'] },
      { h: 'On ne commente pas votre corps', p: ['Nos conseillères sont formées à parler de vêtements, pas de silhouettes. Aucun commentaire sur votre poids, votre âge ou votre forme ne sera fait, ni en bien ni en mal.'] },
      { h: 'Vous pouvez venir accompagnée', p: ['Une sœur, une amie, votre mère. C’est souvent plus simple la première fois.'] },
    ],
    cta: { label: 'Prendre rendez-vous', to: '/rendez-vous?type=mesures' },
  },
];

export const GLOSSARY: { term: string; def: string }[] = [
  { term: 'Tour de dos', def: 'Le chiffre du soutien-gorge, mesuré juste sous la poitrine. Il assure environ 80 % du maintien.' },
  { term: 'Bonnet', def: 'La lettre. Elle exprime l’écart entre le tour de poitrine et le tour de dos, pas un volume absolu. C’est pourquoi un bonnet G sur un petit dos n’a rien d’extraordinaire.' },
  { term: 'Armature', def: 'La tige souple qui suit le sillon sous le sein. Elle doit reposer sur la cage thoracique, jamais sur le sein.' },
  { term: 'Bonnet moulé', def: 'Bonnet préformé d’une seule pièce, invisible sous un vêtement fin.' },
  { term: 'Bonnet emboîtant', def: 'Bonnet formé de plusieurs pièces cousues. Meilleur maintien sur les fortes poitrines.' },
  { term: 'Balconnet', def: 'Bonnet court et horizontal, qui dégage le décolleté.' },
  { term: 'Brassière', def: 'Pièce souple sans armature, enfilée par la tête.' },
  { term: 'Brassière post-opératoire', def: 'Pièce sans armature, à ouverture frontale, conçue pour être portée après une intervention.' },
  { term: 'Prothèse mammaire', def: 'Pièce en silicone ou en mousse, placée dans une poche du soutien-gorge, qui rétablit la symétrie et l’équilibre du buste.' },
  { term: 'Élasthanne', def: 'La fibre élastique qui donne sa tenue au vêtement. Elle est détruite par la chaleur.' },
  { term: 'Sans couture', def: 'Pièce tricotée d’un seul tenant, sans coutures apparentes sous le vêtement.' },
  { term: 'Bétio', def: 'Pagne intime traditionnel, porté sous le vêtement ou dans l’intimité.' },
  { term: 'Bin-bin', def: 'Rang de perles porté à la taille, à même la peau.' },
];
