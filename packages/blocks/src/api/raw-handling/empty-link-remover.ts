/**
 * Whitespace characters treated as empty. Mirrors the rule in `@wordpress/dom`
 * `isEmpty`, which excludes `\s` special spaces.
 *
 * @type {RegExp}
 */
const EMPTY_CHARS = /^[ \f\n\r\t\v\u00a0]*$/;

/**
 * Removes empty link elements.
 *
 * A link is considered empty when it contains no text and no meaningful
 * children (e.g. images). Links wrapping only ignorable whitespace (spaces,
 * `&nbsp;`, `<br>`) are removed.
 *
 * @param node Node to check.
 */
export default function emptyLinkRemover( node: Node ): void {
	if ( node.nodeName !== 'A' ) {
		return;
	}

	const hasMeaningfulContent = Array.from( node.childNodes ).some(
		( child ) => {
			// Line breaks are ignorable whitespace.
			if ( child.nodeName === 'BR' ) {
				return false;
			}

			// Any other element child (e.g. an image) keeps the link.
			if ( child.nodeType === child.ELEMENT_NODE ) {
				return true;
			}

			return ! EMPTY_CHARS.test( ( child as Text ).nodeValue || '' );
		}
	);

	if ( hasMeaningfulContent ) {
		return;
	}

	node.parentNode!.removeChild( node );
}