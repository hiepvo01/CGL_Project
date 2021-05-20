from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from io import StringIO
import os
import string

table = str.maketrans('', '', string.punctuation)

def convert_pdf_to_txt(path):
    rsrcmgr = PDFResourceManager()
    retstr = StringIO()
    codec = 'utf-8'
    laparams = LAParams()
    device = TextConverter(rsrcmgr, retstr, codec=codec, laparams=laparams)
    fp = open(path, 'rb')
    interpreter = PDFPageInterpreter(rsrcmgr, device)
    password = ""
    maxpages = 0
    caching = True
    pagenos=set()

    for page in PDFPage.get_pages(fp, pagenos, maxpages=maxpages, password=password,caching=caching, check_extractable=True):
        interpreter.process_page(page)

    text = retstr.getvalue()

    fp.close()
    device.close()
    retstr.close()

    all_text = text.split('\n')
    start = all_text.index('What few words or phrases would you use to describe the experience to other...') + 1
    end = all_text.index('\x0cQ58 - Would you recommend this program to others? Why or why not?')
    final = [x for x in all_text[start:end] if x != '']
    all = []
    for line in final:
        line_words = []
        # Getting files' individual words in lowercase and no newline or dot symbols
        for w in line.split(" "):
            if '\n' in w:
                w = w.replace('\n', '')
            if '.' in w:
                w = w.replace('.', '')
            if w != "" and w != " ":
                line_words.append(w.lower())
        all += line_words

        # Remove punctuations and populate dictionary
        stripped = [w.translate(table) for w in all]
    return stripped

def read_StopWords():
    # return the list of stopwords
    stopwords = open('stopwords.txt')
    return [w[:-1] for w in stopwords.readlines()] 

def wordCount():
    stopwords = read_StopWords()
    word_dict = {}
    words = []
    for file in os.listdir(os.getcwd() + '\data\JTerm2020Eval'):
        words += convert_pdf_to_txt('data/JTerm2020Eval/' + file)
    for word in words:
        if word not in stopwords:
            if word not in word_dict:
                word_dict[word] = 1
            else:
                word_dict[word] += 1
    return word_dict


print(convert_pdf_to_txt('data/JTerm2020Eval/BIO 247_CGL.pdf'))
# print(os.listdir(os.getcwd() + '\data\JTerm2020Eval'))
print(wordCount())