import matplotlib.pyplot as plt
from matplotlib import font_manager
from seaborn import despine

# Lädt die Fonts aus dem Ordner
font_dirs = ['customFonts/']
font_files = font_manager.findSystemFonts(fontpaths=font_dirs)
for font_file in font_files:
    font_manager.fontManager.addfont(font_file)


def displayPlot(data: str, fontFamily, fontName):
    # Farbe
    colorV = (184/256, 15/256, 15/256)
    # Say, "the default sans-serif font is COMIC SANS"
    plt.rcParams[f'font.sans-serif'] = fontName
    # Then, "ALWAYS use sans-serif fonts"
    plt.rcParams[f'font.family'] = fontFamily

    # Update aller Farben
    params = {"ytick.color": "w",
              "xtick.color": "w",
              "axes.labelcolor": "w",
              "axes.edgecolor": "w"
              }
    plt.rcParams.update(params)
    # Daten aus dem String trennen
    question, total, *answerData = (data.split(","))
    people = []
    values = []
    for a in answerData:
        people.append(a.split(";")[0].replace("+", "\n"))
        values.append(int(a.split(";")[1]))

    # plotting the chart horizontally Daher der Flip[::-1]
    plt.barh(people[::-1], values[::-1], color=colorV)

    # Setzen der Unterschrift (Stimmen)
    plt.xlabel(f'Stimmen (Gesamt: {total})', fontsize=16)
    # Setzten des Fragen Titels
    plt.title(question, color="w", fontsize=22)

    # Hinzufügen der Genauen Stimmenanzahlen hinter den Bars
    for i, v in enumerate(values[::-1]):
        plt.text(v + 0.5, i, str(v), color='white', fontsize=14, ha='left', va='center')
    # Setzen des x-Achse (Platz für Nummer, inlusion der 0)
    plt.xlim((0, round(1.1*values[0])))
    # Entfernt die Zahlenabstände der Achsen
    plt.tick_params(axis='y', labelsize=14)
    plt.tick_params(axis='x', which='both', bottom=False, top=False, labelbottom=False)
    # Entfernt überall (außer unten?) den Strich
    despine(left=True)

    # Speichert ds Bild
    plt.savefig(f"diagramm/{question.replace(' ', '_')[:question.index('?')]}.png", transparent=True, bbox_inches="tight", dpi=300)

    # Cleart alle einstellungen eingaben
    plt.clf()
    plt.cla()


# Für alle Zeilen
for line in open("student3.txt", "r", encoding="utf-8").readlines():
    displayPlot(line[:-1], "Aleo", "Regular")

# Das Problem ist die Spine (bottom) die Nicht die Graphen Länge, sondern nun auch die Y-Label länge umfassen Soll
# Das Problem mit der Überschrift ist das GLeiche, sie soll nicht mehr der Grapghen Beschreiben sondern Auch die Länge der Labels umfassen
# Die Labels sind aber eigentlich nur Zahlen, also nicht lang.
