import { removeEmptyLinks } from '../remove-empty-links';
import { OBJECT_REPLACEMENT_CHARACTER } from '../special-characters';

describe( 'removeEmptyLinks', () => {
	const link = { type: 'core/link' };
	const bold = { type: 'core/bold' };

	it( 'should drop an empty link stored as an object replacement', () => {
		const record = {
			text: `${ OBJECT_REPLACEMENT_CHARACTER }abc`,
			formats: [ , , , ],
			replacements: [ link, , , ],
		};
		const result = removeEmptyLinks( record );

		expect( result ).toEqual( {
			text: `${ OBJECT_REPLACEMENT_CHARACTER }abc`,
			formats: [ , , , ],
			replacements: [ , , , ],
		} );
	} );

	it( 'should strip a link format wrapping only whitespace', () => {
		const record = {
			text: ` \u00a0a`,
			formats: [ [ link ], [ link ], [ bold ] ],
			replacements: [ , , ],
		};
		const result = removeEmptyLinks( record );

		expect( result.formats ).toEqual( [ , , [ bold ] ] );
	} );

	it( 'should keep a link format on real text', () => {
		const record = {
			text: 'abc',
			formats: [ [ link ], [ link ], [ link ] ],
			replacements: [ , , ],
		};
		const result = removeEmptyLinks( record );

		expect( result.formats ).toEqual( [
			[ link ],
			[ link ],
			[ link ],
		] );
	} );

	it( 'should keep non-link replacements untouched', () => {
		const image = { type: 'core/image' };
		const record = {
			text: `${ OBJECT_REPLACEMENT_CHARACTER }a`,
			formats: [ , , ],
			replacements: [ image, , ],
		};
		const result = removeEmptyLinks( record );

		expect( result.replacements[ 0 ] ).toBe( image );
	} );

	it( 'should return the same reference when nothing changes', () => {
		const record = {
			text: 'abc',
			formats: [ [ bold ], [ bold ], [ bold ] ],
			replacements: [ , , ],
		};
		const result = removeEmptyLinks( record );

		expect( result ).toBe( record );
	} );

	it( 'should keep a link run that contains any real text', () => {
		const record = {
			text: ' \u00a0hello',
			formats: [
				[ link ],
				[ link ],
				[ link ],
				[ link ],
				[ link ],
				[ link ],
				[ link ],
			],
			replacements: [ , , , , , , ],
		};
		const result = removeEmptyLinks( record );

		expect( result.formats ).toEqual( [
			[ link ],
			[ link ],
			[ link ],
			[ link ],
			[ link ],
			[ link ],
			[ link ],
		] );
	} );
} );