import ts from "typescript";

const isDocumentation = (comment: string) => comment.includes("@ts-insp");

const trimComment = (comment: string) => {
    const trimmedComment = comment
        .split("\n")
        .map((commentLine) =>
            commentLine
                // Replace tag
                .replace("@ts-insp", "")
                // Trim leading and trailing whitespaces
                .trim()
                // Trim leading / and * characters
                .replace(/^[/\*]+/, "")
                // Trim leading and trailing whitespaces
                .trim()
        )
        .join("\r\n")
        // Remove leading and trailing empty lines
        .trim();

    return trimmedComment;
};

export const getCommentsFromFile = (sourceFile: ts.SourceFile) => {
    const comments: string[] = [];
    ts.forEachChild(sourceFile, (childNode) => {
        if (childNode.pos === childNode.getFullStart()) {
            const ranges = ts.getLeadingCommentRanges(sourceFile.text, childNode.pos);
            if (ranges) {
                // Extract comment blocks
                for (const range of ranges) {
                    const comment = sourceFile.text.substring(range.pos, range.end);
                    if (isDocumentation(comment)) {
                        const trimmedComment = trimComment(comment);
                        comments.push(trimmedComment);
                    }
                }
            }
        }
    });
    return comments.join("\r\n\r\n");
};
