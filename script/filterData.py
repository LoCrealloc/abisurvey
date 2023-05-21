import json as js
from typing import List
with open("results_teacher.json", "r", encoding="utf-8") as f:
    teacherData: dict = js.load(f)
with open("results_student.json", "r", encoding="utf-8") as f:
    studentData: dict = js.load(f)


def cleanUp(data: dict, maxTop: int, fileName: str):
    if fileName == "":
        fileName = f"{data=}fixed".split("=")[0]
    saveFile = open(fileName, "a", encoding="utf-8")

    for question in data:
        questionString: str = question["question"]
        answers: List[dict] = question["answers"]

        totalVotes = 0
        bestList = []
        for answer in answers:
            curName = answer["possibility"]
            curCount = answer["count"]
            for index, item in enumerate(bestList):
                if item[1] < curCount:
                    bestList.insert(index, (curName, curCount))
                    break
            else:
                bestList.append((curName, curCount))
            totalVotes += curCount

        counter = -1
        current = 150
        topList = []
        name = ""
        for i in bestList:
            if counter == maxTop:
                break

            if i[1] == current:
                name = name + "+" + i[0]
                current = i[1]
            elif i[1] < current:
                topList.append((name, current, f"{round(current * 100 / totalVotes, 2)}%"))
                current = i[1]
                name = i[0]
                counter += 1
        topList.pop(0)
        toPrint = f"{questionString},{totalVotes}"
        for idx, itm in enumerate(topList):
            toPrint = toPrint + f",{itm[0]};{itm[1]};{itm[2]}"
        saveFile.write(toPrint.replace("  ", " ") + "\n")


cleanUp(studentData, 3, "student3.txt")
cleanUp(teacherData, 3, "teacher3.txt")
