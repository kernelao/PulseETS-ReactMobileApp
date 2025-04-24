// Import des SVG
import I1NoteAdd from './1noteAdd.svg';
import I1SessionComplete from './1sessionComplete.svg';
import I1TacheComplete from './1tacheComplete.svg';
import I5NotesAdd from './5notesAdd.svg';
import I5SessionsComplete from './5sessionsComplete.svg';
import I5TachesComplete from './5tachesComplete.svg';
import I10SessionsComplete from './10sessionsComplete.svg';
import I15NotesAdd from './15notesAdd.svg';
import I20TachesComplete from './20tachesComplete.svg';
import I25SessionsComplete from './25sessionsComplete.svg';
import I30NotesAdd from './30notesAdd.svg';
import I50SessionsComplete from './50sessionsComplete.svg';
import I50TachesComplete from './50tachesComplete.svg';
import I100NotesAdd from './100notesAdd.svg';
import I100SessionsComplete from './100sessionsComplete.svg';
import I100TachesComplete from './100tachesComplete.svg';

// Mapping des noms vers les icônes SVG
export const badgeMap = {
  '1 note ajoutée': I1NoteAdd,
  '1 session complétée': I1SessionComplete,
  '1 tâche complétée': I1TacheComplete,
  '5 notes ajoutées': I5NotesAdd,
  '5 sessions complétées': I5SessionsComplete,
  '5 tâches complétées': I5TachesComplete,
  '10 sessions complétées': I10SessionsComplete,
  '15 notes ajoutées': I15NotesAdd,
  '20 tâches complétées': I20TachesComplete,
  '25 sessions complétées': I25SessionsComplete,
  '30 notes ajoutées': I30NotesAdd,
  '50 sessions complétées': I50SessionsComplete,
  '50 tâches complétées': I50TachesComplete,
  '100 notes ajoutées': I100NotesAdd,
  '100 sessions complétées': I100SessionsComplete,
  '100 tâches complétées': I100TachesComplete
};

// Descriptions des récompenses pour l'affichage dans la modale
export const badgeDescriptions = {
  '1 note ajoutée': "Tu as ajouté ta toute première note. Bien joué !",
  '1 session complétée': "Félicitations pour ta première session Pomodoro réussie !",
  '1 tâche complétée': "Une tâche de moins dans ta liste. Continue comme ça !",
  '5 notes ajoutées': "Déjà 5 notes créées ! Tu progresses vite.",
  '5 sessions complétées': "Tu as complété 5 sessions. La constance paie !",
  '5 tâches complétées': "Bravo pour les 5 tâches accomplies !",
  '10 sessions complétées': "10 sessions terminées, tu prends le rythme !",
  '15 notes ajoutées': "15 notes, c'est un bon début de carnet numérique.",
  '20 tâches complétées': "20 tâches finalisées, quelle productivité !",
  '25 sessions complétées': "25 sessions ! Tu es un maître du focus.",
  '30 notes ajoutées': "30 notes au compteur. Tu documentes comme un pro.",
  '50 sessions complétées': "50 sessions ! Tu mérites une pause bien méritée.",
  '50 tâches complétées': "50 tâches ? Tu domines ta to-do liste.",
  '100 notes ajoutées': "100 notes ! Tu peux sortir ton prix Pulitzer.",
  '100 sessions complétées': "100 sessions Pomodoro. Discipline de fer !",
  '100 tâches complétées': "Tu as accompli 100 tâches. C’est incroyable !"
};

export default badgeMap;
