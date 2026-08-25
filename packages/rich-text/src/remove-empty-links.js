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
 * - A link wrapping only whitespace lives as a format on that run of
 *   characters, so the whole run has the link format stripped. A run that
 *   also contains real text is left intact.
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
	let newFormats = formats;

	// Drop empty links stored as object replacement characters.
	let newReplacements = replacements;
	if ( newReplacements?.some( ( entry ) => entry?.type === LINK ) ) {
		changed = true;
		newReplacements = newReplacements.map( ( entry, index ) => {
			if ( entry?.type === LINK && text[ index ] === '\ufffc' ) {
				return undefined;
			}
			return entry;
		} );
	}

	// Strip the link format from any run of characters whose link format
	// wraps only whitespace. Scan runs of identical link format presence.
	if ( formats?.some( ( list ) => list?.some( ( f ) => f.type === LINK ) ) ) {
		newFormats = formats.slice();

		for ( let start = 0; start < text.length; ) {
			if ( ! newFormats[ start ]?.some( ( f ) => f.type === LINK ) ) {
				start += 1;
				continue;
			}

			let end = start;
			while (
				end < text.length &&
				newFormats[ end ]?.some( ( f ) => f.type === LINK )
			) {
				end += 1;
			}

			let whitespaceOnly = true;
			for ( let i = start; i < end; i += 1 ) {
				if ( ! EMPTY_CHAR.test( text[ i ] ) ) {
					whitespaceOnly = false;
					break;
				}
			}

			if ( whitespaceOnly ) {
				changed = true;
				const withoutLink = newFormats[ start ].filter(
					( f ) => f.type !== LINK
				);
				// Mirror `filterFormats`: empty format lists become sparse
				// holes rather than empty arrays.
				const cleared = withoutLink.length ? withoutLink : undefined;
				for ( let i = start; i < end; i += 1 ) {
					newFormats[ i ] = cleared;
				}
			}

			start = end;
		}
	}

	if ( ! changed ) {
		return value;
	}

	return { ...value, formats: newFormats, replacements: newReplacements };
}