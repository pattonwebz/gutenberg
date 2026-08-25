/**
 * Whitespace characters that are treated as empty. This mirrors the rule in
 * `@wordpress/dom` isEmpty, which excludes `\s` special spaces.
 *
 * @type {RegExp}
 */
const EMPTY_CHAR = /^[ \f\n\r\t\v\u00a0]$/;

/**
 * Removes empty links from a RichText value.
 *
 * A link is empty when it has no text content, or when it only wraps
 * ignorable whitespace (spaces, `\n`, `&nbsp;` and the like). Two
 * manifestations are handled:
 *
 * - A link element with zero text is kept as an object replacement character
 *   in `replacements` (see `createFromElement`), so that entry is dropped.
 * - A link wrapping only whitespace lives as a format on those characters, so
 *   the link format is stripped from them.
 *
 * Array lengths and selection indices are preserved.
 *
 * @param {Object} value RichTextValue.
 * @return {Object} The value with empty links removed (same reference if
 *                  unchanged).
 */
export function removeEmptyLinks( value ) {
	const { text, formats, replacements } = value;
	const LINK = 'core/link';
	let changed = false;

	let newReplacements = replacements;
	if ( replacements?.some( ( entry ) => entry?.type === LINK ) ) {
		changed = true;
		newReplacements = replacements.map( ( entry, index ) => {
			if ( entry?.type === LINK && text[ index ] === '\ufffc' ) {
				return undefined;
			}
			return entry;
		} );
	}

	let newFormats = formats;
	if (
		formats?.some( ( list ) =>
			list?.some( ( format ) => format.type === LINK )
		)
	) {
		newFormats = formats.map( ( list, index ) => {
			if (
				list.some( ( format ) => format.type === LINK ) &&
				EMPTY_CHAR.test( text[ index ] )
			) {
				changed = true;
				return list.filter( ( format ) => format.type !== LINK );
			}
			return list;
		} );
	}

	if ( ! changed ) {
		return value;
	}

	return { ...value, formats: newFormats, replacements: newReplacements };
}