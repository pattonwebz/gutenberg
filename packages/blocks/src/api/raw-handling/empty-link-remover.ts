import { isEmpty } from '@wordpress/dom';

/**
 * Removes empty link elements.
 *
 * A link is considered empty when it contains no text and no meaningful
 * children (e.g. images). The whitespace rule mirrors `@wordpress/dom`
 * `isEmpty`, which treats `\u00a0` and other form-feeding whitespace as
 * ignorable, so links wrapping only spaces/`&nbsp;`/`<br>` are removed.
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

			return ! isEmpty( ( child as Text ).nodeValue );
		}
	);

	if ( hasMeaningfulContent ) {
		return;
	}

	node.parentNode!.removeChild( node );
}