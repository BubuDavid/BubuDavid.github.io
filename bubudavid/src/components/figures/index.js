import GlosaFigure from './GlosaFigure';
import LienzoFigure from './LienzoFigure';
import PulsoFigure from './PulsoFigure';
import './figures.css';

const FIGURES = { pulso: PulsoFigure, lienzo: LienzoFigure, glosa: GlosaFigure };

/* The figure component of a case study, or null for a station that has none. */
export const figureFor = id => FIGURES[id] ?? null;
