import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, AlignmentType, Footer } from "docx";
import JSZip from "jszip";

// Helper to slugify filename
export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Compiles the ebook content into a standard A4 formatted PDF file using jsPDF.
 */
export function compilePDF(ebook: any, isFreeUser: boolean): Buffer {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pages = ebook.pages || [];
  const totalPages = pages.length;

  pages.forEach((page: any, index: number) => {
    if (index > 0) {
      doc.addPage();
    }

    const pageNum = index + 1;
    const theme = page.bgTheme || "default";
    let isDarkTheme = true;
    if (theme === "sage" || theme === "beige") {
      isDarkTheme = false;
    }

    // Set theme background color fill
    if (theme === "pure-black") {
      doc.setFillColor(0, 0, 0);
      doc.rect(0, 0, 210, 297, "F");
      doc.setTextColor(255, 255, 255);
    } else if (theme === "dark-slate") {
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 297, "F");
      doc.setTextColor(241, 245, 249);
    } else if (theme === "sage") {
      doc.setFillColor(236, 253, 245);
      doc.rect(0, 0, 210, 297, "F");
      doc.setTextColor(20, 83, 45);
    } else if (theme === "beige") {
      doc.setFillColor(245, 245, 220);
      doc.rect(0, 0, 210, 297, "F");
      doc.setTextColor(107, 79, 42);
    } else {
      // Default Obsidian dark theme
      doc.setFillColor(14, 19, 31);
      doc.rect(0, 0, 210, 297, "F");
      doc.setTextColor(255, 255, 255);
    }

    const fontFamily = page.fontFamily || "helvetica";
    let pdfFont = "helvetica";
    if (fontFamily === "serif") {
      pdfFont = "times";
    } else if (fontFamily === "mono") {
      pdfFont = "courier";
    }

    // 1. Cover Page layout
    if (page.type === "cover") {
      doc.setFont(pdfFont, "bold");
      doc.setFontSize(26);
      const titleLines = doc.splitTextToSize(page.title || ebook.title || "Untitled", 170);
      doc.text(titleLines, 105, 100, { align: "center" });

      doc.setFont(pdfFont, "normal");
      doc.setFontSize(14);
      const subtitleLines = doc.splitTextToSize(page.subtitle || "A PageNest Publication", 170);
      doc.text(subtitleLines, 105, 140, { align: "center" });

      doc.setFont(pdfFont, "italic");
      doc.setFontSize(12);
      doc.text(page.author || `By ${ebook.author || "PageNest Editor"}`, 105, 230, { align: "center" });
    }
    // 2. Table of Contents page
    else if (page.type === "toc") {
      doc.setFont(pdfFont, "bold");
      doc.setFontSize(22);
      doc.text("Table of Contents", 20, 40);

      doc.setFont(pdfFont, "normal");
      doc.setFontSize(12);
      let currentY = 60;

      pages.forEach((p: any, idx: number) => {
        if (p.type === "cover" || p.type === "toc") return;
        const pageTitle = p.title || `Section ${idx + 1}`;
        const pageLabel = p.chapterNum ? `${p.chapterNum}: ${pageTitle}` : pageTitle;
        const pageNumText = `Page ${idx + 1}`;

        doc.text(pageLabel, 20, currentY);
        doc.text(pageNumText, 190, currentY, { align: "right" });
        currentY += 12;
      });
    }
    // 3. Structured Content Pages
    else {
      doc.setFont(pdfFont, "bold");
      doc.setFontSize(9);
      const headerText = page.type === "chapter" ? `${page.chapterNum || "Chapter"} - ${page.title || ""}` : (page.title || "Content Section");
      doc.text(headerText.toUpperCase(), 20, 18);
      doc.setDrawColor(isDarkTheme ? 50 : 200, isDarkTheme ? 50 : 200, isDarkTheme ? 50 : 200);
      doc.line(20, 22, 190, 22);

      let currentY = 32;

      if (page.quote) {
        doc.setFont(pdfFont, "italic");
        doc.setFontSize(11);
        const quoteLines = doc.splitTextToSize(`"${page.quote}"`, 160);
        doc.text(quoteLines, 25, currentY);
        currentY += quoteLines.length * 6 + 6;
      }

      if (page.blocks && page.blocks.length > 0) {
        page.blocks.forEach((block: any) => {
          if (currentY > 260) return; // Simple overflow clipping to fit margins

          if (block.type === "heading") {
            doc.setFont(pdfFont, "bold");
            doc.setFontSize(16);
            const blockTitle = doc.splitTextToSize(block.title || "", 170);
            doc.text(blockTitle, 20, currentY);
            currentY += blockTitle.length * 7 + 4;
          } else if (block.type === "paragraph") {
            doc.setFont(pdfFont, "normal");
            doc.setFontSize(11);
            const blockContent = doc.splitTextToSize(block.content || "", 170);
            doc.text(blockContent, 20, currentY);
            currentY += blockContent.length * 6 + 6;
          } else if (block.type === "quote") {
            doc.setFont(pdfFont, "italic");
            doc.setFontSize(11);
            const blockContent = doc.splitTextToSize(`"${block.content || ""}"`, 150);
            doc.text(blockContent, 30, currentY);
            currentY += blockContent.length * 6 + 6;
          } else if (block.type === "checklist" || block.type === "bullet_list") {
            doc.setFont(pdfFont, "normal");
            doc.setFontSize(11);
            (block.items || []).forEach((item: string) => {
              const prefix = block.type === "checklist" ? "[ ] " : "• ";
              const itemLines = doc.splitTextToSize(`${prefix}${item}`, 160);
              doc.text(itemLines, 25, currentY);
              currentY += itemLines.length * 6 + 2;
            });
            currentY += 4;
          } else if (block.type === "image") {
            doc.setDrawColor(isDarkTheme ? 50 : 200, isDarkTheme ? 50 : 200, isDarkTheme ? 50 : 200);
            doc.setFillColor(isDarkTheme ? 25 : 240, isDarkTheme ? 25 : 240, isDarkTheme ? 25 : 240);
            doc.rect(20, currentY, 170, 45, "FD");
            doc.setFont(pdfFont, "bold");
            doc.setFontSize(10);
            doc.text("[ IMAGE ILLUSTRATION ]", 105, currentY + 20, { align: "center" });
            doc.setFont(pdfFont, "normal");
            doc.setFontSize(9);
            const captionLines = doc.splitTextToSize(block.caption || block.imagePrompt || "No prompt provided", 160);
            doc.text(captionLines, 105, currentY + 30, { align: "center" });
            currentY += 55;
          } else if (block.type === "statistic") {
            doc.setFont(pdfFont, "bold");
            doc.setFontSize(20);
            doc.text(block.statValue || "90%", 20, currentY);
            doc.setFont(pdfFont, "normal");
            doc.setFontSize(10);
            const labelLines = doc.splitTextToSize(block.statLabel || "", 130);
            doc.text(labelLines, 50, currentY - 4);
            currentY += Math.max(15, labelLines.length * 5 + 5);
          } else {
            doc.setFont(pdfFont, "normal");
            doc.setFontSize(11);
            const textToDraw = block.content || block.text || block.title || "";
            if (textToDraw) {
              const lines = doc.splitTextToSize(textToDraw, 170);
              doc.text(lines, 20, currentY);
              currentY += lines.length * 6 + 6;
            }
          }
        });
      } else {
        doc.setFont(pdfFont, "normal");
        doc.setFontSize(11);
        const textToDraw = page.content || page.text || "";
        if (textToDraw) {
          const lines = doc.splitTextToSize(textToDraw, 170);
          doc.text(lines, 20, currentY);
          currentY += lines.length * 6 + 6;
        }

        if (page.items && page.items.length > 0) {
          (page.items || []).forEach((item: string) => {
            const itemLines = doc.splitTextToSize(`• ${item}`, 160);
            doc.text(itemLines, 25, currentY);
            currentY += itemLines.length * 6 + 2;
          });
        }
      }
    }

    // Footer decoration line
    doc.setFont(pdfFont, "normal");
    doc.setFontSize(8);
    doc.setDrawColor(isDarkTheme ? 50 : 200, isDarkTheme ? 50 : 200, isDarkTheme ? 50 : 200);
    doc.line(20, 275, 190, 275);

    // Free Tier watermark
    if (isFreeUser) {
      doc.setTextColor(150, 150, 150);
      doc.text("Made with PageNest", 105, 282, { align: "center" });
    }

    doc.setTextColor(isDarkTheme ? 180 : 100, isDarkTheme ? 180 : 100, isDarkTheme ? 180 : 100);
    doc.text(`Page ${pageNum} of ${totalPages}`, 190, 282, { align: "right" });
  });

  return Buffer.from(doc.output("arraybuffer"));
}

/**
 * Compiles the ebook content into a formatted Word Document (.docx) file.
 */
export async function compileDOCX(ebook: any, isFreeUser: boolean): Promise<Buffer> {
  const children: any[] = [];
  const pages = ebook.pages || [];

  pages.forEach((page: any, index: number) => {
    const pageBreak = index > 0;

    if (page.type === "cover") {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 2000, after: 300 },
          children: [
            new TextRun({
              text: page.title || ebook.title || "Untitled",
              bold: true,
              size: 48,
              font: "Arial",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 1500 },
          children: [
            new TextRun({
              text: page.subtitle || "A PageNest Publication",
              italics: true,
              size: 28,
              font: "Arial",
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 1000 },
          children: [
            new TextRun({
              text: page.author || `By ${ebook.author || "PageNest Editor"}`,
              bold: true,
              size: 24,
              font: "Arial",
            }),
          ],
        })
      );
    } else if (page.type === "toc") {
      children.push(
        new Paragraph({
          spacing: { before: pageBreak ? 1000 : 0, after: 400 },
          pageBreakBefore: pageBreak,
          children: [
            new TextRun({
              text: "Table of Contents",
              bold: true,
              size: 36,
              font: "Arial",
            }),
          ],
        })
      );

      pages.forEach((p: any, idx: number) => {
        if (p.type === "cover" || p.type === "toc") return;
        const title = p.title || `Section ${idx + 1}`;
        const label = p.chapterNum ? `${p.chapterNum}: ${title}` : title;
        children.push(
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `${label} ............................................................................ Page ${idx + 1}`,
                size: 24,
                font: "Arial",
              }),
            ],
          })
        );
      });
    } else {
      children.push(
        new Paragraph({
          spacing: { before: pageBreak ? 800 : 0, after: 400 },
          pageBreakBefore: pageBreak,
          children: [
            new TextRun({
              text: page.type === "chapter" ? `${page.chapterNum || "Chapter"} - ${page.title || ""}` : (page.title || "Content Section"),
              bold: true,
              size: 32,
              font: "Arial",
            }),
          ],
        })
      );

      if (page.quote) {
        children.push(
          new Paragraph({
            spacing: { after: 200 },
            indent: { left: 720 },
            children: [
              new TextRun({
                text: `"${page.quote}"`,
                italics: true,
                size: 22,
                font: "Arial",
              }),
            ],
          })
        );
      }

      if (page.blocks && page.blocks.length > 0) {
        page.blocks.forEach((block: any) => {
          if (block.type === "heading") {
            children.push(
              new Paragraph({
                spacing: { before: 200, after: 120 },
                children: [
                  new TextRun({
                    text: block.title || "",
                    bold: true,
                    size: 26,
                    font: "Arial",
                  }),
                ],
              })
            );
          } else if (block.type === "paragraph") {
            children.push(
              new Paragraph({
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: block.content || "",
                    size: 22,
                    font: "Arial",
                  }),
                ],
              })
            );
          } else if (block.type === "quote") {
            children.push(
              new Paragraph({
                spacing: { after: 200 },
                indent: { left: 720 },
                children: [
                  new TextRun({
                    text: `"${block.content || ""}"`,
                    italics: true,
                    size: 22,
                    font: "Arial",
                  }),
                ],
              })
            );
          } else if (block.type === "checklist" || block.type === "bullet_list") {
            (block.items || []).forEach((item: string) => {
              children.push(
                new Paragraph({
                  spacing: { after: 100 },
                  bullet: { level: 0 },
                  children: [
                    new TextRun({
                      text: item,
                      size: 22,
                      font: "Arial",
                    }),
                  ],
                })
              );
            });
          } else if (block.type === "image") {
            children.push(
              new Paragraph({
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: `[Illustration: ${block.caption || block.imagePrompt || "No prompt provided"}]`,
                    color: "555555",
                    size: 20,
                    font: "Arial",
                  }),
                ],
              })
            );
          } else if (block.type === "statistic") {
            children.push(
              new Paragraph({
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: `${block.statValue || ""} - ${block.statLabel || ""}`,
                    bold: true,
                    size: 22,
                    font: "Arial",
                  }),
                ],
              })
            );
          }
        });
      } else {
        const bodyText = page.content || page.text || "";
        if (bodyText) {
          children.push(
            new Paragraph({
              spacing: { after: 200 },
              children: [
                new TextRun({
                  text: bodyText,
                  size: 22,
                  font: "Arial",
                }),
              ],
            })
          );
        }

        if (page.items && page.items.length > 0) {
          (page.items || []).forEach((item: string) => {
            children.push(
              new Paragraph({
                spacing: { after: 100 },
                bullet: { level: 0 },
                children: [
                  new TextRun({
                    text: item,
                    size: 22,
                    font: "Arial",
                  }),
                ],
              })
            );
          });
        }
      }
    }
  });

  const footerChildren: any[] = [];
  if (isFreeUser) {
    footerChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: "Made with PageNest",
            color: "888888",
            size: 16,
            font: "Arial",
          }),
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        footers: {
          default: new Footer({
            children: footerChildren,
          }),
        },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

/**
 * Compiles the ebook content into a standard EPUB container structure using JSZip.
 */
export async function compileEPUB(ebook: any, isFreeUser: boolean): Promise<Buffer> {
  const zip = new JSZip();

  // 1. mimetype (must be the first file and uncompressed!)
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

  // 2. META-INF/container.xml
  const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
  zip.file("META-INF/container.xml", containerXml);

  const pages = ebook.pages || [];
  const manifestItems: string[] = [];
  const spineItems: string[] = [];
  const tocEntries: string[] = [];

  pages.forEach((page: any, index: number) => {
    const pageId = `page_${index + 1}`;
    const fileName = `${pageId}.xhtml`;
    let pageContent = "";

    const fontFamily = page.fontFamily || "sans-serif";
    const bgTheme = page.bgTheme || "default";

    let bgStyle = "background-color: #0E131F; color: #FFFFFF;";
    if (bgTheme === "pure-black") {
      bgStyle = "background-color: #000000; color: #FFFFFF;";
    } else if (bgTheme === "dark-slate") {
      bgStyle = "background-color: #0F172A; color: #F1F5F9;";
    } else if (bgTheme === "sage") {
      bgStyle = "background-color: #ECFDF5; color: #14532D;";
    } else if (bgTheme === "beige") {
      bgStyle = "background-color: #F5F5DC; color: #6B4F2A;";
    }

    if (page.type === "cover") {
      pageContent = `<div class="cover-container" style="text-align: center; margin-top: 15%;">
        <span class="theme-tag" style="border: 1px solid rgba(124,58,237,0.3); padding: 5px 12px; border-radius: 20px; font-size: 0.8em; text-transform: uppercase;">${ebook.template_name || "Publication"}</span>
        <h1 style="font-size: 2.5em; font-weight: bold; margin-top: 20px;">${page.title || ebook.title || "Untitled"}</h1>
        <p style="font-size: 1.2em; opacity: 0.8; margin-top: 15px;">${page.subtitle || "A PageNest Publication"}</p>
        <p style="font-size: 1.1em; font-weight: bold; margin-top: 50px;">${page.author || `By ${ebook.author || "PageNest Editor"}`}</p>
      </div>`;
    } else if (page.type === "toc") {
      let listHtml = "";
      pages.forEach((p: any, idx: number) => {
        if (p.type === "cover" || p.type === "toc") return;
        const title = p.title || `Section ${idx + 1}`;
        listHtml += `<li style="margin-bottom: 10px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 5px;">
          <a href="page_${idx + 1}.xhtml" style="color: inherit; text-decoration: none;">${p.chapterNum ? `${p.chapterNum}: ` : ""}${title}</a>
          <span style="float: right;">Page ${idx + 1}</span>
        </li>`;
      });
      pageContent = `<div>
        <h2 style="border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 10px; font-size: 1.8em;">Table of Contents</h2>
        <ul style="list-style: none; padding-left: 0; margin-top: 20px;">
          ${listHtml}
        </ul>
      </div>`;
    } else {
      let bodyHtml = "";
      if (page.title || page.chapterNum) {
        bodyHtml += `<h2 style="font-size: 1.6em; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 5px; margin-top: 10px;">${
          page.type === "chapter" ? `${page.chapterNum || "Chapter"} - ${page.title || ""}` : (page.title || "Content Section")
        }</h2>`;
      }

      if (page.quote) {
        bodyHtml += `<blockquote style="border-left: 3px solid #7C3AED; padding-left: 15px; font-style: italic; opacity: 0.9; margin: 15px 0;">${page.quote}</blockquote>`;
      }

      if (page.blocks && page.blocks.length > 0) {
        page.blocks.forEach((block: any) => {
          if (block.type === "heading") {
            bodyHtml += `<h3 style="font-size: 1.3em; margin-top: 15px;">${block.title || ""}</h3>`;
          } else if (block.type === "paragraph") {
            bodyHtml += `<p style="line-height: 1.6; margin-bottom: 15px;">${block.content || ""}</p>`;
          } else if (block.type === "quote") {
            bodyHtml += `<blockquote style="border-left: 3px solid #7C3AED; padding-left: 15px; font-style: italic; opacity: 0.9; margin: 15px 0;">${block.content || ""}</blockquote>`;
          } else if (block.type === "checklist" || block.type === "bullet_list") {
            bodyHtml += `<ul style="margin-bottom: 15px; padding-left: 20px;">`;
            (block.items || []).forEach((item: string) => {
              bodyHtml += `<li style="margin-bottom: 5px;">${item}</li>`;
            });
            bodyHtml += `</ul>`;
          } else if (block.type === "image") {
            bodyHtml += `<div style="border: 1px solid rgba(255,255,255,0.1); padding: 15px; text-align: center; background-color: rgba(255,255,255,0.02); margin: 15px 0; border-radius: 10px;">
              <p style="font-weight: bold; margin-bottom: 10px;">[ Illustration ]</p>
              <p style="font-size: 0.9em; opacity: 0.7;">${block.caption || block.imagePrompt || "No prompt provided"}</p>
            </div>`;
          } else if (block.type === "statistic") {
            bodyHtml += `<div style="background-color: rgba(124,58,237,0.1); border-left: 4px solid #7C3AED; padding: 15px; margin: 15px 0; border-radius: 5px;">
              <span style="font-size: 2.2em; font-weight: bold; color: #7C3AED; display: block; margin-bottom: 5px;">${block.statValue || "90%"}</span>
              <span style="font-size: 0.95em; opacity: 0.8;">${block.statLabel || ""}</span>
            </div>`;
          }
        });
      } else {
        const bodyText = page.content || page.text || "";
        if (bodyText) {
          bodyHtml += `<p style="line-height: 1.6; margin-bottom: 15px;">${bodyText}</p>`;
        }
        if (page.items && page.items.length > 0) {
          bodyHtml += `<ul style="margin-bottom: 15px; padding-left: 20px;">`;
          (page.items || []).forEach((item: string) => {
            bodyHtml += `<li style="margin-bottom: 5px;">${item}</li>`;
          });
          bodyHtml += `</ul>`;
        }
      }

      pageContent = bodyHtml;
    }

    let watermarkHtml = "";
    if (isFreeUser) {
      watermarkHtml = `<div class="watermark" style="text-align: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; margin-top: 30px; font-size: 0.75em; opacity: 0.5;">Made with PageNest</div>`;
    }

    const xhtml = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
  <title>${page.title || "Page"}</title>
  <link rel="stylesheet" type="text/css" href="styles.css" />
</head>
<body style="${bgStyle} font-family: ${fontFamily}; margin: 20px; padding-bottom: 50px;">
  ${pageContent}
  ${watermarkHtml}
</body>
</html>`;

    zip.file(`OEBPS/${fileName}`, xhtml);

    manifestItems.push(`<item id="${pageId}" href="${fileName}" media-type="application/xhtml+xml"/>`);
    spineItems.push(`<itemref idref="${pageId}"/>`);

    const title = page.title || (page.type === "cover" ? "Cover" : page.type === "toc" ? "Contents" : `Page ${index + 1}`);
    tocEntries.push(`<navPoint id="${pageId}" playOrder="${index + 1}">
      <navLabel><text>${title}</text></navLabel>
      <content src="${fileName}"/>
    </navPoint>`);
  });

  const stylesCss = `body { font-family: sans-serif; }
h1, h2, h3 { font-family: serif; color: inherit; }
blockquote { margin: 1em 20px; color: #7C3AED; border-left: 3px solid #7C3AED; padding-left: 15px; }`;
  zip.file("OEBPS/styles.css", stylesCss);

  manifestItems.push(`<item id="styles" href="styles.css" media-type="text/css"/>`);

  const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${ebook.id}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
     </head>
  <docTitle>
    <text>${ebook.title || "Untitled"}</text>
  </docTitle>
  <navMap>
    ${tocEntries.join("\n    ")}
  </navMap>
</ncx>`;
  zip.file("OEBPS/toc.ncx", tocNcx);

  manifestItems.push(`<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>`);

  const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="pub-id" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">urn:uuid:${ebook.id}</dc:identifier>
    <dc:title>${ebook.title || "Untitled"}</dc:title>
    <dc:creator>${ebook.author || "PageNest Editor"}</dc:creator>
    <dc:language>en</dc:language>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, "Z")}</meta>
  </metadata>
  <manifest>
    ${manifestItems.join("\n    ")}
  </manifest>
  <spine toc="ncx">
    ${spineItems.join("\n    ")}
  </spine>
</package>`;
  zip.file("OEBPS/content.opf", contentOpf);

  return await zip.generateAsync({ type: "nodebuffer" });
}
