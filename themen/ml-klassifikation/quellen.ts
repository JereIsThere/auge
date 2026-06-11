import type { Quelle } from '@/types';

// Wissenschaftliche Quellen des ML-Klassifikation-Themas.
// Verwendung in Lektionen über den Convenience-Wrapper:
//   <MlQuelle id="breiman2001-rf" kernaussagen={["…"]} />

export const ML_QUELLEN: Quelle[] = [
  {
    typ: 'paper',
    id: 'hughes2015-plantvillage',
    titel:
      'An open access repository of images on plant health to enable the development of mobile disease diagnostics',
    autoren: ['David P. Hughes', 'Marcel Salathé'],
    jahr: 2015,
    arxiv: '1511.08060',
  },
  {
    typ: 'paper',
    id: 'mohanty2016-deeplearning',
    titel: 'Using Deep Learning for Image-Based Plant Disease Detection',
    autoren: ['Sharada P. Mohanty', 'David P. Hughes', 'Marcel Salathé'],
    jahr: 2016,
    venue: 'Frontiers in Plant Science',
    doi: '10.3389/fpls.2016.01419',
  },
  {
    typ: 'paper',
    id: 'cox1958-logistic',
    titel: 'The Regression Analysis of Binary Sequences',
    autoren: ['David R. Cox'],
    jahr: 1958,
    venue: 'Journal of the Royal Statistical Society, Series B',
    doi: '10.1111/j.2517-6161.1958.tb00292.x',
  },
  {
    typ: 'paper',
    id: 'cortes1995-svm',
    titel: 'Support-Vector Networks',
    autoren: ['Corinna Cortes', 'Vladimir Vapnik'],
    jahr: 1995,
    venue: 'Machine Learning 20',
    doi: '10.1007/BF00994018',
  },
  {
    typ: 'paper',
    id: 'boser1992-kernel',
    titel: 'A Training Algorithm for Optimal Margin Classifiers',
    autoren: ['Bernhard E. Boser', 'Isabelle M. Guyon', 'Vladimir N. Vapnik'],
    jahr: 1992,
    venue: 'COLT 1992',
    doi: '10.1145/130385.130401',
  },
  {
    typ: 'paper',
    id: 'ho1995-randomforests',
    titel: 'Random Decision Forests',
    autoren: ['Tin Kam Ho'],
    jahr: 1995,
    venue: 'ICDAR 1995',
    doi: '10.1109/ICDAR.1995.598994',
  },
  {
    typ: 'paper',
    id: 'breiman2001-rf',
    titel: 'Random Forests',
    autoren: ['Leo Breiman'],
    jahr: 2001,
    venue: 'Machine Learning 45',
    doi: '10.1023/A:1010933404324',
  },
  {
    typ: 'paper',
    id: 'lecun1998-lenet',
    titel: 'Gradient-Based Learning Applied to Document Recognition',
    autoren: ['Yann LeCun', 'Léon Bottou', 'Yoshua Bengio', 'Patrick Haffner'],
    jahr: 1998,
    venue: 'Proceedings of the IEEE',
    doi: '10.1109/5.726791',
  },
  {
    typ: 'paper',
    id: 'krizhevsky2012-alexnet',
    titel: 'ImageNet Classification with Deep Convolutional Neural Networks',
    autoren: ['Alex Krizhevsky', 'Ilya Sutskever', 'Geoffrey E. Hinton'],
    jahr: 2012,
    venue: 'NeurIPS 2012',
    url: 'https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html',
  },
  {
    typ: 'paper',
    id: 'howard2017-mobilenets',
    titel:
      'MobileNets: Efficient Convolutional Neural Networks for Mobile Vision Applications',
    autoren: ['Andrew G. Howard', 'Menglong Zhu', 'Bo Chen', 'Dmitry Kalenichenko'],
    jahr: 2017,
    arxiv: '1704.04861',
  },
  {
    typ: 'paper',
    id: 'pedregosa2011-sklearn',
    titel: 'Scikit-learn: Machine Learning in Python',
    autoren: ['Fabian Pedregosa', 'Gaël Varoquaux', 'Alexandre Gramfort'],
    jahr: 2011,
    venue: 'Journal of Machine Learning Research 12',
    arxiv: '1201.0490',
  },
];

export function mlQuelleFinden(id: string): Quelle | undefined {
  return ML_QUELLEN.find((q) => q.id === id);
}
