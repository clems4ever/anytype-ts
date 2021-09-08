import { I } from 'ts/lib';

export enum TextStyle {
	Paragraph	 = 0,
	Header1		 = 1,
	Header2		 = 2,
	Header3		 = 3,
	Header4		 = 4,
	Quote		 = 5,
	Code		 = 6,
	Title		 = 7,
	Checkbox	 = 8,
	Bulleted	 = 9,
	Numbered	 = 10,
	Toggle		 = 11,
	Description	 = 12,
};

export enum MarkType {
	Strike		 = 0,
	Code		 = 1,
	Italic		 = 2,
	Bold		 = 3,
	Under		 = 4,
	Link		 = 5,
	Color		 = 6,
	BgColor		 = 7,
	Mention		 = 8,
	Emoji		 = 9,
};

export interface TextRange {
	from: number;
	to: number;
};

export interface Mark {
	range: TextRange;
	type: MarkType;
	param?: string;
};

export interface ContentText {
	text: string;
	style: TextStyle;
	marks: Mark[];
	number: number;
	checked: boolean;
	color: string;
	bgColor: string;
};

export interface BlockText extends I.Block {
	content: ContentText;
};