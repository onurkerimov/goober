import * as CSS from 'csstype';

declare const props: unique symbol

export function extractCss(target?: Element): string;

export function injectGlobal(
    tag: CSSAttribute | TemplateStringsArray | string,
    ...props: Array<string | number>
): void;

export function css(
    tag: CSSAttribute | TemplateStringsArray | string,
    ...props: Array<string | number>
): string;
export function css<Props>(
    tag: CSSAttribute<Props> | TemplateStringsArray | string,
    ...props: Array<string | number>
): ClassName<Props>;

export function keyframes(
    tag: CSSAttribute | TemplateStringsArray | string,
    ...props: Array<string | number>
): string;
export function keyframes<Props>(
    tag: CSSAttribute<Props> | TemplateStringsArray | string,
    ...props: Array<string | number>
): ClassName<Props>;

export function dynamic<Props,>(className: ClassName<Props>, props: Props): CSSProperties

type CSSValue<T, P = void> = T | ((props: P) => T )
type CSSPrimitive<P = void> = string | number | undefined | null | ((props: P) => string)
type CSSMappedProperties<P = void> = {
    [K in keyof CSSProperties]: CSSValue<CSSProperties[K], P>;
}

type CSSProperties = CSS.PropertiesFallback<number>

export type CSSAttribute<P> = CSSMappedProperties<P> & {
    [key: string]: CSSAttribute<P> | CSSPrimitive<P>;
}

// interface CSSAttributeOld extends CSSProperties {
//     [key: string]: CSSAttribute | string | number | undefined | null;
// }


