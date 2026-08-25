import emptyLinkRemover from '../empty-link-remover';
import { deepFilterHTML } from '../utils';

describe( 'emptyLinkRemover', () => {
	it( 'should remove an empty link', () => {
		expect(
			deepFilterHTML( '<a href="https://example.com"></a>', [
				emptyLinkRemover,
			] )
		).toEqual( '' );
	} );

	it( 'should remove a link wrapping only whitespace', () => {
		expect(
			deepFilterHTML( '<a href="https://example.com">  </a>', [
				emptyLinkRemover,
			] )
		).toEqual( '' );
	} );

	it( 'should remove a link wrapping only a non-breaking space', () => {
		expect(
			deepFilterHTML( '<a href="https://example.com">&nbsp;</a>', [
				emptyLinkRemover,
			] )
		).toEqual( '' );
	} );

	it( 'should remove a link wrapping only a line break', () => {
		expect(
			deepFilterHTML( '<a href="https://example.com"><br></a>', [
				emptyLinkRemover,
			] )
		).toEqual( '' );
	} );

	it( 'should keep a link with text', () => {
		expect(
			deepFilterHTML( '<a href="https://example.com">Example</a>', [
				emptyLinkRemover,
			] )
		).toEqual( '<a href="https://example.com">Example</a>' );
	} );

	it( 'should keep a link with an image inside', () => {
		expect(
			deepFilterHTML(
				'<a href="https://example.com"><img src="x.png" alt="x"></a>',
				[ emptyLinkRemover ]
			)
		).toEqual(
			'<a href="https://example.com"><img src="x.png" alt="x"></a>'
		);
	} );

	it( 'should keep non-link elements', () => {
		expect( deepFilterHTML( '<p></p>', [ emptyLinkRemover ] ) ).toEqual(
			'<p></p>'
		);
	} );
} );