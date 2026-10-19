# The 6MX's figures from three Soviet sources

This file gives every technical figure in the three Soviet documents in this folder, transcribed in Russian with an English translation. It was read off page images rendered at 200 dpi, with small print enlarged to 500 dpi (15 October 2026). None of the scans has a text layer, so each reading is by eye. The **Sure** column says how sure each reading is:

- **certain**: clean typescript or print, read twice.
- **likely**: legible but faint or blurred; the reading fits the context.
- **inferred**: an interpretation, not a printed number.

Page numbers are the documents' own sheet or page numbers. For the PDFs these are also the page in the file, unless the table says otherwise.

## The documents

| Short name | What it is | Source of the scan |
|---|---|---|
| **TU** | `6MX-TU-25-07-1533-84.pdf`. *Хронометры морские 6МХ. Технические условия ТУ 25-07.1533-84* ("Marine chronometers 6MX. Technical conditions"). These are the factory's binding specification for production, acceptance and type testing. It is 31 typed sheets from the First Moscow Watch Factory im. S. M. Kirov (Первый Московский часовой завод им. С.М. Кирова, 1-й МЧЗ), drafted in December 1983. It was approved by the head of Soyuzchasprom, A. S. Samsonov, and agreed with military units В/Ч 25106 and 15097, Sudoimport and NIIChasprom. It took effect on 21.12.84 and was valid until 01.01.88, extended by hand to 01.01.91. Amendment No. 1 is dated 03.01.88 and is marked ① on the sheets. Group П12, ОКП 42 8215, UDC 681.113.92. | Johannes Altmeppen, 2017 (watermarked) |
| **Instr. 1954** | `Instruktsiya-246-54-chronometers-1954.pdf`. *Инструкция 246-54 по поверке образцовых хронометров* ("Instruction 246-54 for verifying standard chronometers"). It was written by TsNII radioizmerenii and approved by order No. 293 of the Chief Chamber of Measures and Measuring Instruments, USSR Ministry of Finance, on 20 July 1954. It came into force on 1 January 1955. The scan is the 1971 reprint by Izdatel'stvo standartov, 32 pp. It is generic: it covers every make of chronometer (its worked examples are Nardin, Lange and Ericsson), not the 6MX in particular. | Altmeppen, 2017 |
| **User instr.** | `6MX-user-instruction_1…5.jpg`. *Морской хронометр «6-МХ» (контактный). Инструкция для пользования* ("Marine chronometer 6-MX (contact). Instructions for use"). It is a booklet from the First Moscow Watch Factory, Moscow, Vorontsovskaya ul. 35-b. Print run 1000, order 469, undated (probably the 1950s to 1960s). The images are spreads of booklet pages 1–9. | Altmeppen, 2017 |
| **Book 1963** | `6MX-Hemmung_1…4.jpg`. V. A. Shpolyanskii and A. M. Kuritskii (В. А. Шполянский, А. М. Курицкий), *Спусковые регуляторы приборов времени* ("Escapement regulators of timekeeping instruments"), Mashgiz, Moscow 1963: the title page and pp. 166–171. The title page reads **Курицкий** (Kuritskii), not "Kuroshkin". | Altmeppen, 2017 |

A fifth source, **Tarasov 1976** (`Tarasov-1976-Pribory-vremeni/`, pp. 244–251; the whole book in `books/`), describes the **later, redesigned 6MX** (a 16-tooth escape wheel and a 75/10 seconds stage, where Kirov 247 and the drawings have 15 teeth and 80/10). Its figures are in section 9, apart from the rest: they aren't this model's sizes, but they are the only source that dimensions a 6MX's mainspring, balance, hairspring and chain, and the GOST its trial follows.

**What none of the documents give.** Of the four above, none gives a number for the escapement's angles: lock, drop, lift, impulse or unlocking. None gives the hairspring's material or turns, the mainspring's dimensions or torque, an isochronism figure (rate at full wind against 24 h), position errors, or the gimbals' tilt. The only figure for the balance's swing is the 1954 instruction's generic 225–270°. The 6MX's own documents, the TU and the user instruction, give no swing at all.

---

## 1. Basic parameters (TU §1.2, sheet 3)

| Quantity | Russian (as printed) | English | Value | Page | Sure |
|---|---|---|---|---|---|
| Variants, codes and jewels (Table 1) | Хронометр морской 6МХ — 42 8215 0001 08 — 15 камней — контактного устройства не имеется | Marine chronometer 6MX: 15 jewels, no contact device | 15 jewels | TU 3 | certain |
| | Хронометр морской 6МХ, экспорт — 42 8215 0003 06 — 15 — то же | 6MX, export: 15 jewels, no contacts | 15 | TU 3 | certain |
| | Хронометр морской контактный 6МХ — 42 8215 0002 07 — 20 — имеется | 6MX with contacts: 20 jewels, has a contact device | 20 jewels | TU 3 | certain |
| | Хронометр морской контактный 6МХ, экспорт — 42 8215 0004 05 — 20 — имеется | 6MX with contacts, export: 20 jewels | 20 | TU 3 | certain |
| Movement calibre | 1.2.2. Калибр механизма, мм — 85,0 | Diameter of the movement | **85.0 mm** | TU 3 | certain |
| Movement height | 1.2.3. Высота механизма, мм — 39,8 | Height of the movement | **39.8 mm** | TU 3 | certain |
| Escapement type | 1.2.4. Тип спуска — хронометровый | Type of escapement: chronometer (detent) | detent | TU 3 | certain |
| Balance period | 1.2.5. Период колебания баланса, с — 0,5 | Balance's period of oscillation, s. This is the TU's wording; the 1954 text below calls the same 0.5 s the period and also the hand's jump. | **0.5 s** | TU 3 | certain |
| Up-down indicator | 1.2.6. Емкость счетчика, ч — 56 | Capacity of the wind indicator ("counter") | **56 h** | TU 3 | certain |
| Box | 1.2.7. Габаритные размеры футляра, мм — 190x190x190 | Overall dimensions of the box | **190 × 190 × 190 mm** | TU 3 | certain |
| Mass | 1.2.8. Масса, кг, не более — 2,2 | Mass, not more than | **≤ 2.2 kg** | TU 3 | certain |
| Service life | 1.2.9. Средний срок службы, лет, не менее — 10 | Mean service life, not less than | **≥ 10 years** | TU 3 | certain |
| Contact rating | 1.2.10. Контактное устройство может коммутировать постоянный ток не более 5 мА напряжением от 1,5 до 6 В при активной нагрузке | The contact device can switch DC of no more than 5 mA at 1.5–6 V, resistive load | ≤ 5 mA, 1.5–6 V | TU 3 | certain |
| Coatings | 1.2.11. … покрытия по ГОСТ 9.301-86 (amended from -78) | Coatings to GOST 9.301-86 | — | TU 3 | certain |
| Environmental class | 1.2.12. По … ГОСТ 12997-84 … обыкновенного исполнения | Ordinary version under GOST 12997-84 | — | TU 4 | certain |
| Repairability | 1.2.13. … Вероятность восстановления … не менее 0,9 за время 36 ч | Probability of restoring a failed chronometer, at least 0.9 within 36 h | 0.9 / 36 h | TU 4 | certain |
| Operating climate | … исполнению ОМ, категории 4 ГОСТ 15150-69, но для работы при температурах от 4 до 36 °С | Marine climate version ОМ, category 4, but for working at 4 to 36 °C | **4–36 °C** | TU 2 | certain |
| Modifications | Хронометры выпускаются двух модификаций: бесконтактные и контактные | Made in two versions: without and with contacts | — | TU 2 | certain |
| Time scale | 1.3.5. … отрегулированы по среднесолнечному или звездному времени. Примечание: … звездных — 23 ч 56 мин 04,09 с среднего солнечного времени | Regulated to mean solar or to sidereal time. The sidereal day is 23 h 56 min 04.09 s of mean time. A sidereal chronometer's dial bears an asterisk (§1.5.1). | — | TU 5, 7 | certain |
| Hands | 1.3.3 … При совмещении минутной стрелки с 12-ти часовой отметкой … отклонение часовой стрелки от этой отметки не допускается. 1.3.4. Несовпадение секундной стрелки с любым отдельным штрихом шкалы не должно быть более ширины секундной стрелки | With the minute hand on 12, the hour hand may not be off its mark. The seconds hand may miss any mark by no more than its own width. | — | TU 4–5 | certain |
| Movement fixing | 1.3.6. Крепление механизма в корпусе … исключающим возможность перемещения механизма при заводке | The movement must not shift in the case during winding | — | TU 5 | certain |
| Warranty | 6.2. Гарантийный срок эксплуатации — 24 месяца со дня ввода … но не более 30 месяцев со дня выдачи паспорта | 24 months from entry into service, at most 30 months from the issue of the passport | 24 / 30 months | TU 24 | certain |
| Kit (Table 3) | Хронометр АКУ2.813.009; Ящик АКУ4.171.002; Ключ заводной АКУ6.395.400; Чехол АКУ6.832.000; Контакт выводной АКУ6.622.003 (контактного); Замша 100x100 мм; Паспорт …009ПС; Техническое описание и инструкция по эксплуатации …009ТО | Chronometer, box, winding key, cover, output contact (contact version only), a 100 × 100 mm chamois, passport, technical description and operating instructions | — | TU 6 | certain |

The design documents named are АКУ 2.813.009 (6MX) and АКУ 2.813.004 (contact 6MX); the operating manual is АКУ 2.813.004 ТО (TU 2, 24). They are not in this folder.

## 2. Rate tolerances (the TU's acceptance figures)

TU §1.3.1 (sheet 4) applies "в диапазоне рабочих температур от 4 до 36 °С, относительной влажности от 30 до 80 % и атмосферном давлении от 83992,86 до 106657,60 Па (от 630 до 800 мм рт.ст.)". In English: over the working temperatures 4–36 °C, 30–80 % relative humidity and 630–800 mm Hg.

**Table 2: Метрологические характеристики / Предельные значения** (metrological characteristics / limits). All readings are certain.

| Russian | English | Limit | Definition (TU §3.1, sheets 17–18) |
|---|---|---|---|
| Среднее отклонение суточного хода, E, с | Mean deviation of the daily rate, E, s | **±0.35** | E = (e₁ + … + e₂₅)/25: each daily rate's absolute departure from its period's mean, over the 25 counted days (5 periods × 5 days) |
| Восстановление хода, R, с | Recovery of rate, R, s | **±2.00** | R = ω_V − ω_I: the mean rate of period V (36 °C) less that of period I (36 °C) |
| Максимальная вариация суточного хода, Д, с | Largest variation of the daily rate, D, s | **±2.30** | D = (ω_k − ω_k−1)max: the largest difference between consecutive daily rates in any period |
| Температурный коэффициент, C, с/град | Temperature coefficient, C, s per °C | **±0.10** | C = (ω₃₆ − ω₄)/32, with ω₃₆ = (ω_I + ω_V)/2 and ω₄ = ω_III |
| Вторичная ошибка компенсации, S, с | Secondary (middle-temperature) error of compensation, S, s | **±1.20** | S = (ω₃₆ + ω₄)/2 − ω₂₀, with ω₂₀ = (ω_II + ω_IV)/2 |
| Средний суточный ход в любом из периодов испытаний, ω, с | Mean daily rate in any test period, ω, s | **±3.50** | ω_ср = the mean of the five counted days of the period, sign kept; "минус означает опережение, плюс — отставание" (minus = gaining, plus = losing) |
| Оценочное число, N | Figure of merit, N | **30** (upper limit) | N = 42E + 4.5R + 60C + 2.4S (formula 8; it prints "4,5P", meaning R) |

What these limits mean in practice:

- **Temperature.** C ±0.10 s/°C means a rate difference of up to **3.2 s a day between 36 °C and 4 °C**.
- **Middle-temperature error.** S ±1.20 s a day is the middle-temperature error allowed.

A **failure** in the reliability test is defined as one of these (TU §1.3.12, sheet 6):

- the chronometer stops;
- the winding mechanism fails;
- any figure of §1.3.1 is exceeded by more than three times its limit: "превышение любого показателя … по абсолютному значению, более, чем в три раза".

The defect classifier (TU Appendix 2, sheet 28) puts two defects in the **critical** class:

- 000 "останов" (stopping);
- 001 "Превышение величины среднего суточного хода над установленной, не устраняемой регулировочными винтами" (a mean daily rate beyond the limit that the regulating screws can't remove).

The **significant** defects are a seconds hand off its marks (100), an up-down hand that doesn't match the true state of wind (101), and a loose movement in its case (102).

### The same quantities in the 1963 book (GOST 8916-58)

Book 1963, p. 169, Table 8 ("выдержки из ГОСТа 8916-58", extracts from GOST 8916-58). The table is printed clean and every reading is certain.

| No. | Russian | English | Class I | Class II |
|---|---|---|---|---|
| 1 | Продолжительность испытаний в сутках | Duration of the trial, days | **63** | **35** |
| 2 | Средний суточный ход любого периода испытаний Ω_срт в сек | Mean daily rate in any period, s | **±3.00** | **±4.00** |
| 3 | Среднее отклонение суточного хода E в сек | Mean deviation of the daily rate E, s | **±0.20** | **±0.40** |
| 4 | Восстановление хода R в сек | Recovery of rate R, s | **±1.50** | **±2.00** |
| 5 | Максимальная вариация хода D в сек | Largest variation of rate D, s | **±2.00** | **±2.50** |
| 6 | Температурный коэффициент C в сек/°C | Temperature coefficient C, s/°C | **±0.10** | **±0.10** |
| 7 | Температура периодов испытаний в °C (длительность периода 7 суток) | Temperatures of the periods, °C (7 days each) | +36; +28; +20; +12; +4; +12; +20; +28; +36 | +36; +20; +4; +20; +36 |

The book introduces the table with these words (p. 168, certain): "Отечественная промышленность выпускает морские хронометры 6МХ (фиг. 5.63), в которых применяется рассмотренный выше регулятор с хронометровым ходом. Требования к точности хода этих хронометров, широко используемых в навигации, при научных, гравиметрических, геодезических и других измерениях, весьма высоки." In English: Soviet industry makes the 6MX marine chronometers, which use the detent regulator just described. The demands on the accuracy of these chronometers, widely used in navigation and in scientific, gravimetric and geodetic measurement, are very high.

Comparing the two:

- **Class II.** The TU's 35-day, five-period test (36/20/4/20/36 °C) is GOST 8916-58's **class II** trial. The TU's limits fall between that GOST's class I and class II: E 0.35 against 0.20/0.40, R 2.00 against 1.50/2.00, D 2.30 against 2.00/2.50, ω 3.50 against 3.00/4.00.
- **GOST 8916-70.** The TU's limits are exactly **class 2 of GOST 8916-70** (Tarasov 1976, section 9): E ±0.35, R ±2.0, D ±2.30, C ±0.10, S ±1.20, ω ±3.50, the same trial. The revision of 1970 tightened E and ω and added S; the TU adds only the figure of merit N ≤ 30.

### The same quantities in the 1954 instruction (generic standard chronometers)

| Russian | English | Value | Page | Sure |
|---|---|---|---|---|
| Табл. 1: Образцовые хронометры 1-го класса — ω_ср ±2 сек, m ±0,2 сек, δ ±0,2 сек | Class 1 standard chronometers: mean daily rate ±2 s; rms deviation of single daily rates from their mean m ±0.2 s; rms variation of the daily rate δ ±0.2 s | ±2 / ±0.2 / ±0.2 s | 1954 p. 10 | certain (500 dpi) |
| Образцовые хронометры 2-го класса — ±4 сек, ±0,5 сек, ±0,5 сек | Class 2: ±4 s, ±0.5 s, ±0.5 s | ±4 / ±0.5 / ±0.5 s | 1954 p. 10 | certain |
| п. 29: … не менее чем 10 суточных ходов … 1) средним квадратичным уклонением m … 2) средней квадратичной вариацией суточного хода δ. Примечание: Вариацией суточного хода называется разность значений двух смежных суточных ходов | Quality from at least 10 daily rates: (1) rms deviation m of the single rates from their mean; (2) rms variation δ. A variation is the difference of two adjacent daily rates. | n ≥ 10 days | 1954 p. 10 | certain |
| п. 50: δ = ±√(Σδ²/(n−1)), m = ±√(ΣV²/(n−1)); п. 53, corrected for comparison error: δ = ±√(Σδ²/(n−1) − 6m_T²), m = ±√(ΣV²/(n−1) − 2(n+1)/n·m_T²); m_T ±0,03 с by ear, ±0,02 с by the Kukov–Preinich method | Formulae for δ and m | — | 1954 pp. 15–16 | likely (blurred formulae) |
| п. 35: … при постоянной температуре не ниже +15 °C и не выше +25 °C. Допускается изменение температуры в пределах 2° за весь период исследования | Tested at a constant temperature between +15 and +25 °C, which may change by no more than 2° over the whole test | 15–25 °C, ±2° | 1954 p. 11 | certain (500 dpi) |
| пп. 36–37 | Three days' settling if the chronometer was running at the customer's; 10 days after repair, cleaning or transport | 3 d / 10 d | 1954 p. 11 | likely |
| Worked examples (App. 7–9) | Ericsson No. 465 (table chronometer), 10 rates at +21.3 °C: ω = −0.2 s, δ = ±0.1, m = ±0.1, class 1. Ericsson No. 71 at +20.5 °C: ω = +5.3 s, so no certificate ("mean daily rate exceeds 4 s"). Lange No. 407 at +21.6 °C: δ ±1.1, m ±0.9 > ±0.5, unfit. | — | 1954 pp. 29–32 | likely |

The 1954 instruction tests at a single temperature only. It has no temperature coefficient and no secondary error.

## 3. Test procedure and periods (TU §3)

| Quantity | Russian | English | Value | Page | Sure |
|---|---|---|---|---|---|
| Trial | 3.1. … определением суточных ходов в течение 35 суток, разделенных на 5 периодов по 7 суток … (табл. 5) | Daily rates over 35 days, in 5 periods of 7 days | 35 d = 5 × 7 d | TU 16 | certain |
| Table 5 | Номер периода I, II, III, IV, V — Номинальная температура, °C 36, 20, 4, 20, 36 | Period temperatures | **36 / 20 / 4 / 20 / 36 °C** | TU 16 | certain |
| Days counted | 3.1.1. … пяти последовательных ходов данного периода … (первые двое суток каждого периода при расчетах во внимание не принимают) | The mean of five consecutive rates; the first two days of each period are not counted | 5 of 7 days | TU 17 | certain |
| Reference | … образцового средства измерений, имеющего относительную погрешность не более 5·10⁻⁸ … ω = (τᵢ − τᵢ₊₁)/T … τᵢ, τᵢ₊₁ — интервалы времени, измеренные частотомером | Comparison with a reference of relative error ≤ 5·10⁻⁸. The daily rate is the difference of two intervals measured by a counter on consecutive days, over one day. | 5·10⁻⁸ | TU 16 | certain |
| Accuracy | Допустимая погрешность проверки хронометров должна находиться в пределах ±0,02 с | Permitted error of the check | ±0.02 s | TU 16 | certain |
| Sidereal | ω_зв = ((τᵢ − τᵢ₊₁) − K_зв)/T_зв, K_зв = 4,1 с; сверка … ровно через звездные сутки | For a sidereal chronometer: K = 4.1 s, compared exactly one sidereal day apart | 4.1 s | TU 17 | certain |
| Daily winding | В процессе испытаний хронометры должны заводиться ежедневно в одно и то же время до совмещения стрелки указателя степени заводки с цифрой "8" после окончания сверки | During the trial, wound daily at the same time, after the comparison, until the up-down hand reaches the figure "8" | wind to "8" | TU 16 | certain |
| End of period | В конце каждого периода испытаний хронометры заводятся до совмещения стрелки указателя степени заводки с цифрой "0" | At the end of each period, wound until the hand reaches "0" | wind to "0" | TU 16–17 | certain (text); see note |
| Equipment (App. 3) | Climatic chamber "Feutron" 3001 (±1 °C); quartz synchronometer Ч7-15 (±250 µs a day); counter Ч3-54 (0.1 to 10⁵ s); a converter of the chronometer's sound to electrical pulses that starts the counter (≥ 2 V into 200 Ω, pulse (2 ± 1) µs); scales ±5 g; caliper 0.05 mm; watchmaker's loupe ЛЧ-2.8× | Test equipment | — | TU 29 | likely (instrument designations faint) |

**Note on "8" and "0"** (inferred, medium confidence). The user instruction says the up-down hand shows "сколько времени прошло с момента последнего завода" (how much time has passed since the last winding; user instr. p. 3). On that reading:

- **"0" is full wind** on the 56 h scale.
- **Winding daily to "8"** leaves the spring 8 h short of full wind, so the trial runs on the spring between about 8 h and 32 h down.
- **Winding at the end of each period** goes up to full wind.

The 1954 instruction (p. 9, certain at 500 dpi) has a marine chronometer wound until "указатель заводки остановился на середине промежутка между штрихами «0» и «8»" (the indicator stops midway between the strokes "0" and "8"), which is about 4 h short of full wind.

None of the documents gives an isochronism figure: no rate at full wind against 24 h down. Winding short of the top every day is how the procedure avoids that part of the spring.

| Quantity | Russian | English | Value | Page | Sure |
|---|---|---|---|---|---|
| Running time | 1.3.2. Продолжительность действия хронометров от полностью заведенной пружины должна быть не менее 56 ч. 3.2: … от начала действия механизма при полной заводке пружины до момента прекращения его работы | Running time from full wind at least 56 h, measured from full wind to stopping | **≥ 56 h** | TU 4, 18 | certain |
| Running time (user instr.) | Полный завод пружины обеспечивает работу механизма хронометра в течение 56 часов | A full wind runs the movement 56 hours | 56 h | User instr. p. 4 | certain |
| Running time (1954) | п. 28: Заводная пружина хронометра должна гарантировать указанный на циферблате заводки срок работы … например, 56 ч. п. 33: если хронометр остановится раньше предельного срока, указанного на циферблате заводки … бракуется | The mainspring must give the running time shown on the up-down dial, e.g. 56 h; if it stops sooner the chronometer is rejected | 56 h | 1954 pp. 10–11 | certain |
| Periodic tests | 2.3.1. … один раз в год выборочным методом; ГОСТ 18321-73 / 18242-72, степень С-2, приемочный уровень дефектности 4 % | Periodic tests once a year by sampling, acceptance quality level 4 % | 1/yr, AQL 4 % | TU 13–14 | certain |
| Reliability | 1.3.12. Вероятность безотказной работы за 4000 ч при температуре (20 ± 5) °C должна быть не менее 0,94. 2.4.2: … не реже одного раза в три года; Pα = 0,94, Pβ = 0,80, β = 0,2, α = 0,1; объём выборки n = 20, приемочное число отказов C = 2 | Probability of running without failure for 4000 h at 20 ± 5 °C at least 0.94. Tested at least once in three years: sample of 20, at most 2 failures accepted. | 0.94 / 4000 h | TU 6, 15 | certain |
| Acceptance | 2.2.2. … сплошному контролю (Table 4): metrological characteristics, running time, hands, movement fixing, appearance, contacts, marking, completeness. Dimensions, mass, transport, climate and reliability are tested in periodic tests only | Every chronometer gets the 35-day trial at acceptance | — | TU 10–11 | certain |

## 4. Shock, vibration and climate (packed for transport)

The TU has no test of shock or vibration while running, and none of the gimbals' tilt. All of these tests are on the chronometer **packed for transport**. Afterwards there must be no mechanical damage and the rate must meet §1.3.1 (or the mean rate, for the climatic tests).

| Test | Russian | English | Value | Page | Sure |
|---|---|---|---|---|---|
| Transport shaking (requirement) | 1.3.10. … транспортной тряски с ускорением 30 м/с² при частоте от 80 до 120 ударов в минуту или 15000 ударов с тем же ускорением | Transport shaking at 30 m/s² and 80–120 blows a minute, or 15,000 blows at the same acceleration | 30 m/s² (≈ 3 g) | TU 5 | certain |
| Transport shaking (method) | 3.11. … на испытательном стенде в течение 2 ч при ускорении 30 м/с² и числе ударов 80–120 в минуту. … в положении, определяемом манипуляционным знаком № 11 | 2 h on a test stand at 30 m/s², 80–120 blows a minute, upright as the package's handling mark No. 11 shows | 2 h | TU 19 | certain |
| Alternative | … в кузове грузовой автомашины … 200 км по грунтовой дороге со скоростью 30 км/ч и 300 км по проселочным дорогам со скоростью 20 км/ч | Or carried in a lorry: 200 km of dirt road at 30 km/h and 300 km of country roads at 20 km/h | 500 km | TU 20 | certain |
| Stand (App. 3) | Стенд имитации транспортирования СИТ … 4–12 Гц, ускорение 1,5–5 (g) | Transport simulator, 4–12 Hz, 1.5–5 g | — | TU 29 | likely |
| Heat and cold | 1.3.11.1: 50 °C short term and cycling −60 to +50 °C. 3.12: −60 °C for 2 h (±2 °C), then (20 ± 5) °C; +50 °C for 2 h, then 24 h at (20 ± 5) °C, wind, mean rate over 3 days; cycle +50 °C 2 h → −60 °C 2 h → +50 °C 2 h, transfer ≤ 10 min | Storage temperatures | −60 to +60 °C | TU 5, 20–21 | certain |
| Humidity | 3.13: 30 °C, 80 % (±3 %, ±3 °C), ≤ 24 h, then 24 h in normal conditions; no corrosion, mean rate within limits | Humidity | 80 % at 30 °C | TU 21 | certain |
| Low pressure | 3.14: 26664,40 Па (200 мм рт.ст.) at (20 ± 5) °C, 30 min, then 83992,86 Па (630 мм) for 5 min; mean rate over 3 days | Low pressure (air transport) | 200 mm Hg | TU 6, 21–22 | certain |
| Storage | 4.3: условиям 1 ГОСТ 15150-69, но при температуре от 10 до 30 °C и относительной влажности воздуха не более 80 %; 4.4: … не должны подвергаться действию магнитных полей | Stored at 10–30 °C, ≤ 80 % RH, away from magnetic fields | 10–30 °C | TU 23 | certain |
| Packing | 1.6.1. … упакован в футляр АКУ4.161.002 циферблатом вниз. Перед упаковыванием заводная пружина должна быть полностью спущена, баланс должен быть поставлен на клин | Packed dial down, mainspring fully let down, balance wedged | — | TU 8 | certain |
| Packing (user instr.) | Balance stopped with two cork wedges; gimbals locked | — | — | User instr. p. 8 | likely |

## 5. The balance's swing, the beat and the escapement

| Quantity | Russian | English | Value | Source | Sure |
|---|---|---|---|---|---|
| **Swing (amplitude)** | п. 10: Регулятором хода хронометра служит система баланса с волоском, совершающая периодические колебания с амплитудой 225—270° | The chronometer's regulator is the balance-and-hairspring system, oscillating with an amplitude of 225–270° | **225–270°** | 1954 p. 5 | certain (500 dpi) |
| Beat | п. 1: … хронометровым спуском и балансом с периодом колебания и одновременно скачком секундной стрелки — 0,5 сек | … a chronometer escapement and a balance whose period of oscillation, and likewise the seconds hand's jump, is 0.5 s | 0.5 s | 1954 p. 2 | likely |
| Beat (TU) | 1.2.5. Период колебания баланса, с — 0,5 | Period of the balance | 0.5 s | TU 3 | certain |
| Seconds hand | Секундная стрелка хронометра позволяет замерять промежутки времени до 0,5 секунды | The seconds hand measures intervals to 0.5 s | 0.5 s | User instr. p. 3 | certain |
| One impulse a period | … баланс получает один импульс за каждое полное колебание | The balance gets one impulse for each complete oscillation | — | 1954 p. 7 | certain |
| Not self-starting | Хронометровый спуск не обладает свойством самопуска … необходимо раскачать баланс путем поворота хронометра около его оси | The detent escapement doesn't start by itself; the balance must be set swinging by turning the chronometer about its axis | — | 1954 p. 7 | certain |
| Starting (6MX) | … начинает вновь работать после завода лишь при легком толчке, сообщаемом его балансу легким поворотом хронометра вокруг оси стрелки. Во избежание остановки … или несвоевременного пропуска зуба ходового колеса, указанный поворот … не должен быть резким или сильным | After running down, it restarts only with a light jerk given to the balance by turning the chronometer gently about the hands' axis. The turn must not be sharp or strong, or the chronometer may stop or **let an escape-wheel tooth pass at the wrong time**. | — | User instr. p. 4 | certain |
| **Gallop (1954)** | При достижении балансом амплитуды большей 700° (например, под действием внешнего толчка) спусковой камень два раза освободит спусковое колесо за время одного колебания, а стрелка сделает два скачка вместо одного. Этот недостаток, называемый «галопированием», может длиться неопределенное время | If the balance reaches an amplitude above **700°** (for example after a knock), the discharge stone frees the escape wheel twice in one oscillation and the hand jumps twice. This "galloping" can last indefinitely. | > 700° | 1954 p. 7 | certain (500 dpi) |
| **Gallop (1963)** | … галопирования, которое возникает в том случае, когда под действием ударов или сотрясений амплитуда колебаний превысит 360°, произойдет многократное освобождение ходового колеса и оно получит добавочные импульсы | Galloping arises when knocks or shaking take the amplitude past **360°**: the escape wheel is released repeatedly and receives extra impulses. | > 360° | Book p. 171 | certain |
| Gallop check (1954) | п. 27: Хронометр не должен галопировать: за одно колебание баланса секундная стрелка должна совершать скачок на 1/2 секунды, а не на одну или более | The chronometer must not gallop: one oscillation of the balance must move the seconds hand by ½ s, not 1 s or more | — | 1954 p. 10 | certain |

**The two gallop figures** (inferred). They differ by a factor of two, so they almost certainly measure different things:

- the 1963 book's 360° is the swing to one side;
- the 1954 instruction's 700° is evidently the whole arc of one oscillation, side to side.

That makes the 1954 figure about 350° to one side, consistent with the book. It also leaves open whether the 1954 instruction's **225–270°** is measured to one side or as a whole arc. Only to one side is plausible: 112–135° each way would be far too small for a chronometer. For comparison, the Hamilton manual's 1⅜–1½ turns is 247.5–270° to one side.

### The escapement's phases and angles: Fig. 5.64 (Book 1963, pp. 170–171)

The text and figure name the angles as symbols only. **No angle is given a number** anywhere on pp. 166–171. Fig. 5.64 б is a schematic of where the angles lie on the balance's arc. The book is a general description of the spring-detent escapement, introduced with the 6MX (Figs. 5.61–5.63) as its example. The symbols, transcribed with certain readings:

| Symbol | Russian (book's words) | English | Defined as |
|---|---|---|---|
| Φ | крайнее положение (амплитуда) | The extreme position (the amplitude) | −Φ … +Φ |
| φ_д1 | дополнительный угол … от −Φ до −φ₁ | Supplementary arc, from −Φ to −φ₁ | Φ − φ₁ |
| −φ₁ | спусковой камень ударяет в выступающую часть спусковой пружины | The discharge stone strikes the passing (gold) spring's projecting end | start of unlocking |
| β′ | (поворот пружины покоя) | The detent's own turn while unlocking | — |
| β | угол отпирания β = \|φ₁\| − \|φ₂\| | Unlocking angle | \|φ₁\| − \|φ₂\| |
| α₁ | (зубец 3) проходит угол падения α₁ | Drop of tooth 3 onto the impulse pallet | — |
| −φ′₂ | спусковой камень сходит с пружины, пружина покоя возвращается | The discharge stone leaves the passing spring; the detent returns | — |
| β_n | угол взаимодействия баланса с пружиной покоя β_n = \|φ₁\| − \|φ′₂\| | Angle over which the balance works with the detent | \|φ₁\| − \|φ′₂\| |
| ξ | свободный угол | Free arc between release and the impulse | — |
| φ₃ | зуб 3 догоняет импульсный камень при φ = \|φ₃\| > \|φ₂\| (удар в начале импульса) | Tooth 3 catches the impulse pallet: impact at the start of the impulse | — |
| λ | импульс … скольжением … λ = \|φ₃\| + φ₄ | Impulse angle, by sliding | \|φ₃\| + φ₄ |
| +φ₄ | конец импульса | End of the impulse | — |
| α₂ | зуб 2 после падения α₂ ложится на камень покоя | Tooth 2 drops (α₂) onto the locking stone | — |
| β₃ | на обратном ходе спусковой камень … отгибает спусковую пружину на угол β₃ = \|φ₅\| − \|φ₁\| | On the return swing the discharge stone bends the passing spring through β₃ | \|φ₅\| − \|φ₁\| |
| −φ₅ | спусковая пружина возвращается | The passing spring falls back | — |
| φ_д2 | (second supplementary arc, Fig. 5.64 б) | — | — |
| "момент притяжки" | зуб 1 … на срезанной части камня покоя создаёт … момент, прижимающий её к упору | Draw: the tooth on the locking stone's cut face makes a moment that holds the detent against its banking | (draw, no angle) |

Other statements in the book (pp. 170–171, certain):

- **Advantages.** One impulse a period; a smaller escapement error ("уменьшение ошибки, вносимой системой хода"); smaller energy losses; the dynamics adjustable by setting the balance's position of rest.
- **Passing spring and isochronism.** "Неизохронную ошибку, вносимую системой хода, уменьшает и наличие спусковой пружинки": the passing spring itself also reduces the isochronism error that the escapement introduces.
- **Sensitivity to knocks.** "относительно высокой чувствительностью к ударам": the escapement is relatively sensitive to knocks.
- **The 6MX's escapement** (p. 168). It consists of the escape wheel (13) and the detent spring (8), with its spring part (10), fixed to the plate by its block (11). The passing spring (9) rests on a projection at the detent's end. The locking stone (7) is shellacked into the detent's thickened part. Screw 12 sets the locking stone against the escape-wheel tooth.
- **1954 instruction, п. 11** (p. 6). "Винтом-ограничителем 11 устанавливается глубина сцепления камня покоя с зубцами спускового колеса": a banking screw sets the depth of lock. No value is given.

The 1954 instruction's Рис. 4–5 (pp. 6–7) and the book's Fig. 5.64 a are schematic. A protractor reading off them would be an estimate, so none is given here.

## 6. Balance, hairspring, jewels, mainspring

| Quantity | Russian | English | Value | Source | Sure |
|---|---|---|---|---|---|
| Balance (6MX) | Фиг. 5.62. Интегральный баланс хронометра 6МХ | Fig. 5.62: "integral" balance of the 6MX chronometer | — | Book p. 168 | certain |
| Balance (text) | Колебательная система … компенсационный биметаллический разрезной баланс 1 с осью 5 и цилиндрическая спираль 3 … На дугах обода баланса имеются грузы 2, которые … перемещают вдоль обода для температурной компенсации. Гайками 16 … регулируют период колебаний … поэтому градусник отсутствует | The oscillating system is a compensating **bimetallic cut balance** (1) on its staff (5) with a **cylindrical (helical) hairspring** (3). The weights (2) on the rim's arcs are moved along the rim for temperature compensation. Nuts (16) on their screws regulate the period, so there is **no regulator index**. | — | Book p. 167 | certain |
| Weights' place (Fig. 5.62) | 30°, 30° (dimensioned) | The weights are centred 30° either side of the centre line through the rim's cuts, which runs perpendicular to the arm, with nuts 16 at the arm's ends | 30° | Book p. 168 | likely (figure reading) |
| "≈15°" (Fig. 5.62) | ≈15° | The angle at the hairspring's stud (19) from the same centre line | ≈ 15° | Book p. 168 | likely; its meaning is inferred |
| Hairspring ends | Цилиндрическая спираль баланса снабжена концевыми кривыми. Концы спирали крепятся конусными штифтами в колодке 17 и в колонке 19 | The helical spring has terminal curves; its ends are pinned with taper pins in the collet (17) and the stud (19) | — | Book p. 168 | certain |
| Rollers | На оси 5 … колодка 17, импульсный ролик 15 с импульсным камнем 14 и спусковой ролик 4 со спусковым камнем 6 | On the staff: collet, impulse roller with impulse stone, discharge roller with discharge stone | — | Book p. 168 | certain |
| Balance endstone | … нижний накладной камень 18 изготовляется не из синтетического рубина, а из алмаза … при колебаниях тяжелого баланса … интенсивный износ камня из синтетического рубина | The lower endstone is **diamond**, not synthetic ruby, because the heavy balance wears a ruby endstone quickly | diamond | Book p. 168 | certain |
| Balance inertia (general) | Возможность применения … балансов с весьма значительным моментом инерции¹ (J ≈ 0,2 ÷ 0,3 Г·мм·сек²) также повышает точность. ¹ Это объясняется тем, что габариты хронометров строго не ограничены, и есть возможность применить пружинный двигатель достаточной мощности | Being able to use balances of a very large moment of inertia, J ≈ 0.2–0.3 gf·mm·s², also raises accuracy. Footnote: chronometers' size isn't strictly limited, so a strong enough mainspring can be used. | **≈ 1,960–2,940 g·mm²** (converted at 1 gf·mm·s² = 9,806.65 g·mm²) | Book p. 171 | certain (text); the figure is for marine chronometers in general, not stated for the 6MX |
| Compensation (1954) | Температурная компенсация … достигается сочетанием либо стального волоска с разрезным биметаллическим балансом, либо волоска из сплава типа элинвара или ниварокса с монометаллическим балансом | Compensated either by a steel hairspring with a cut bimetallic balance, or by an elinvar- or Nivarox-type spring with a monometallic balance | — | 1954 p. 6 | likely |
| Hairspring (1954) | Волосок 19 … обычно цилиндрический (геликоидальный) | The hairspring is usually helical | — | 1954 p. 5 | likely |
| Jewels | (Table 1) | 15 jewels without contacts, 20 with contacts | 15 / 20 | TU 3 | certain |
| Mainspring and fusee (1954) | п. 5–7: заводная пружина — плоская стальная лента; улитка … с винтовой канавкой; тонкая стальная цепь Галля; вспомогательный завод … может действовать в течение 1—2 мин | Flat steel mainspring; a fusee with a helical groove; a fine steel Gall (fusee) chain; maintaining power that runs for 1–2 min | 1–2 min | 1954 p. 5 | likely |
| Stop works (1954) | п. 8: … используется часть кривой момента, незначительно отступающего от пропорциональности углу закручивания | The stops confine the spring to the part of its torque curve that departs little from proportionality to the angle wound | — | 1954 p. 5 | likely |
| Mainspring (TU, user instr.) | — | No dimensions, material or torque | — | — | — |

The materials of the 6MX's hairspring and balance are not stated in any of the documents. The book calls the balance bimetallic and cut, and Fig. 5.62 calls it "integral". The hairspring's number of turns is also not stated for this 6MX; the later 6MX's (Tarasov 1976, section 9) is 9 turns.

## 7. Gimbals, winding, contacts (operation)

| Quantity | Russian | English | Value | Source | Sure |
|---|---|---|---|---|---|
| Gimbals | … укреплен на кардановом подвесе во внутреннем деревянном футляре, который … помещен во внешний футляр с мягкой обивкой, служащей защитой от сотрясений и резких перемен температуры | Mounted in gimbals in an inner wooden box, inside an outer box with soft padding against shocks and sudden changes of temperature | — | User instr. p. 3 | certain |
| Gimbals (1954) | п. 21: … кардановый подвес должен обеспечивать горизонтальное положение стекла при основных качаниях футляра | The gimbals must keep the glass horizontal under the box's main motions | (no angle) | 1954 p. 10 | likely |
| Level (1954) | п. 18: … в горизонтальном положении, иначе неминуемы значительные колебания суточного хода | Keep it horizontal, or large swings of the daily rate are inevitable | — | 1954 p. 9 | likely |
| Winding (user instr.) | … медленно и осторожно поворачивают на бок (в кардановом подвесе) … подводя стрелку счетчика завода до деления «8» … в один и тот же час суток до одного и того же показания … для сохранения постоянного напряжения пружины, т. е. до деления «8» | Turned slowly onto its side in the gimbals and wound until the indicator reaches "8", at the same hour each day, so the spring's tension stays the same | to "8" | User instr. p. 4 | certain |
| Hand setting | (key on the minute arbor's square, forward only) … в обратном направлении может вызвать поломку зубцов ходового колеса | Turning backwards can break the escape wheel's teeth | — | User instr. p. 5 | likely |
| Contacts (user instr.) | ток не более 5 мА; нормально 2–3 мА; поляризованное реле 700 Ом, конденсатор 1 мкФ, 1,5 В (6 В — реле 2800 Ом) | Contact current ≤ 5 mA, normally 2–3 mA; polarized relay 700 Ω with a 1 µF capacitor at 1.5 V (2,800 Ω relay at 6 V) | — | User instr. pp. 5–6 | likely |
| Contacts (1954) | п. 13–14: контактное колесо 60 зубцов … 60-й зуб срезан → интервал 1,5 с на минуте; ток ≤ 5–7 мА | A 60-tooth contact wheel on the seconds arbor; the 60th tooth is cut away, which marks the minute with a 1.5 s gap; ≤ 5–7 mA | — | 1954 pp. 7–8 | likely |
| Maintenance (1954) | п. 19: чистка и свежее масло каждые три года | Clean and re-oil every three years | 3 years | 1954 p. 9 | likely |


## 8. The test cards: passports and attestats of real 6MXs

The TU's (or GOST 8916's) trial figures as each chronometer's passport or attestat states them (`../photos/dg-chrono-6mx-gallery/bilder-zum-6mx/`, Altmeppen's scans), in seconds a day, losing positive as the TU counts. Read on 16 October 2026 (the estimates survey, PLAN-wempe-estimates.md's Physics appendix); 09218, 20027 and 22823 read again on 18 October 2026 and agreeing. The model's scatter and drift are calibrated on their E and R, its secondary error checked against their S (`tools/wempe_errorbudget.js`, `tools/wempe_thermal.js`).

| Chronometer | Date | Files | E | R | D | C | S | ω max | N | Note |
|---|---|---|---|---|---|---|---|---|---|---|
| Kirov 1564 | 1955 | `13_…16_Kirow_1564_Attestat_*` | ±0.119 | −1.66 | 0.67 | −0.004 | +0.74 | | | attestat; the trial wound "from 32 to 8 hours by the up-and-down dial" (заводка … от 32 до 8 часов по счетчику завода) |
| Kirov 308 | 1953 | `1_2`, `1_3_Kirow_308` | ±0.143 | −0.78 | 0.58 | −0.087 | +0.235 | | | under the older 32/18/4 °C trial |
| Kirov 707 | 1973 | `2_2`, `2_3_Kirow_707` | ±0.25 | +0.02 | 0.78 | −0.065 | +1.06 | | | |
| Poljot 09218 | 7 May 1984 | `11_`, `12_`, `13_Poljot_09218_Pasport_*` | ±0.20 | +0.24 | −0.83 | +0.01 | +0.83 | −0.81 | 12 | GOST 8916-77; period means +0.41, −0.14, +0.20, −0.81, +0.65; deviations' sum 5.29/25 |
| Kirov 22823 | 1 November 1986 | `12_Kirow_22823_Pasport_1_Gost_8916-77`, `13_Kirow_22823_Pasport_2` | ±0.2 | −0.28 | −0.73 | +0.08 | +0.79 | +1.90 | 16 | GOST 8916-77; its own table (period means −0.82, −1.79, −2.44, −2.89, −2.46; sum 7.39/25) works out E 0.30, R −1.64, C +0.025, S +0.30: not the figures stated |
| Poljot 20027 | 1 February 1993 | `12_`, `13_Poljot_20027_Pasport_*` | ±0.25 | +0.03 | −1.29 | +0.02 | +0.60 | +1.20 | 13 | TU 25-07.1533-84 |
| Kirov 91 | 1970 | `7_2_Kirow_91`; passport `11_`, `12_Kirow_91_Pasport*` | ±0.26 | −1.31 | | +0.093 | −1.24 | | | S an outlier |
| Kirov 92 | 1970 | `8_2_Kirow_92`; passport `10_`, `11_Kirow_92-Pasport*` | ±0.31 | −0.06 | | +0.009 | | | | |

Medians: E 0.225, |R| 0.26, D 0.755 (six); C's spread (sd) 0.062 (eight); S +0.80 ±0.17 (the five of the TU's trial, 91's left out).

## 9. The later 6MX: Tarasov 1976

*Приборы времени* (Tarasov, 1976), Ch. 9 "Механические приборы времени служебного назначения", §1 "Хранители точного времени", "Морской хронометр 6МХ", pp. 244–251 (`Tarasov-1976-Pribory-vremeni/p244.png`–`p251.png`). Read on 19 October 2026 off the page images at 150 dpi, Fig. 145 at 330 dpi. The print is clean: every reading is **certain** unless the table says otherwise.

This is the **later, redesigned 6MX**: its escape wheel has 16 teeth and its seconds stage is 75/10 (Table 28, Fig. 145 a), where Kirov 247 and the Wempe drawings have 15 teeth and 80/10 (both give 7200 beats an hour). So none of its sizes is this model's: the drawings decide. Its figures serve as a cross-check on the model's physics, and as what a Soviet designer of the 1970s gave the same kind of chronometer.

### GOST 8916-70 (pp. 244–247)

| No. | Russian | English | Class 1 | Class 2 |
|---|---|---|---|---|
| 1 | Среднее отклонение суточного хода E | Mean deviation of the daily rate, s | **±0.17** | **±0.35** |
| 2 | Восстановление хода R | Recovery of rate, s | **±1.50** | **±2.0** |
| 3 | Максимальная вариация суточного хода D | Largest variation of the daily rate, s | **±2.00** | **±2.30** |
| 4 | Температурный коэффициент C | Temperature coefficient, s/°C | **±0.07** | **±0.10** |
| 5 | Вторичная ошибка S | Secondary error, s | **±1.00** | **±1.20** |
| 6 | Средний суточный ход любого периода ω_ср | Mean daily rate in any period, s | **±2.00** | **±3.50** |
| 7 | Поверка … для 1-го класса — в течение 63 сут., разделенных на девять периодов по 7 сут. … +36°; +28°; +20°; +12°; +4°; +12°; +20°; +28°; +36°; для 2-го класса — в течение 35 сут. … пять периодов … +36°; +20°; +4°; +20°; +36° (pp. 246–247) | The trial | 63 days: 9 periods of 7 at 36/28/20/12/4/12/20/28/36 °C | 35 days: 5 periods of 7 at 36/20/4/20/36 °C |
| 8 | Вероятность безотказной работы за 6000 ч (p. 247) | Probability of running without failure for 6000 h | **0.90** | **0.85** |

Class 2 is the TU's trial and limits, figure for figure (section 2). The GOST also sets the balance's period, T = 0.5 s, and the running time from a full wind, at least 56 h (p. 247).

The definitions (pp. 245–246), with the periods numbered I–IX (class 1) or I–V (class 2):

| Quantity | Class 1 | Class 2 | Note |
|---|---|---|---|
| E | Σ\|e\|/n, n = 45 | n = 25 | e: each daily rate's departure from its period's mean |
| R | ω_IX − ω_I | ω_V − ω_I | The mean rates of the last and first periods |
| D | ω_k − ω_k−1, the largest over the whole trial | the same | |
| C | As printed: 1/40 (ω₃₆ − ω₄) + (ω₂₈ − ω₁₂)/2, with ω₄ = ω_V, ω₁₂ = (ω_IV + ω_VI)/2, ω₂₈ = (ω_II + ω_VIII)/2 | (ω₃₆ − ω₄)/32, with ω₄ = ω_III, ω₃₆ = (ω_I + ω_V)/2 | Class 1's must be [(ω₃₆ − ω₄) + (ω₂₈ − ω₁₂)/2]/40 (inferred: the bracket was lost in print, since 32 + 16/2 = 40). Class 1's ω₃₆ isn't printed; it is evidently (ω_I + ω_IX)/2. |
| S | (ω₃₆ + ω₄)/2 − ω₂₀ − ½[(ω₂₈ + ω₁₂)/2 − ω₂₀], with ω₂₀ = (ω_III + ω_VII)/2 | (ω₃₆ + ω₄)/2 − ω₂₀, with ω₂₀ printed as (ω_II − ω_IV)/2 | Class 2's minus is a misprint for + (the TU has (ω_II + ω_IV)/2) |
| ω_ср | The mean of the period's last five daily rates, sign kept: "минус означает опережение, плюс — отставание" (minus gaining, plus losing) | the same | |

### The movement (pp. 247–250)

| Quantity | Russian | English | Value | Page |
|---|---|---|---|---|
| Maker | выпускаемого серийно 1-м Московским часовым заводом | Made in series by the 1st Moscow Watch Factory | — | 247 |
| Dial (Рис. 139) | две боковые шкалы: нижняя — для показаний секунд и верхняя — для показаний часов заводки пружины с делениями от 0 до 56 ч и свободным интервалом на 8 ч | Two subsidiary dials: seconds below; the up-and-down above, divided 0 to 56 h with a free interval of 8 h | 0–56 h + 8 h | 247 |
| Section (Рис. 140) | барабан 1 — улитка 2 — центральное 3 — промежуточное 4 — секундное 5 — ходовое колесо 6 и баланс 7 | Through every arbor: barrel, fusee, centre, intermediate, seconds, escape wheel, balance (schematic) | — | 247 |
| Barrel to fusee | Расстояние между их центрами 42 мм | Distance between their centres | **42 mm** | 247 |
| Barrel | наружный диаметр 41,5 мм и внутренний 37,8 мм. Диаметр валика барабана 12,6 мм | Outside and inside diameters; the barrel arbor | **Ø 41.5, Ø 37.8; arbor Ø 12.6** | 248 |
| Mainspring | длина L = 1400 мм; ширина b = 14,8 мм; толщина h = 0,42 мм | Length, width, thickness | **1400 × 14.8 × 0.42 mm** | 248 |
| Its turns | в свободном состоянии n_св = 6,5; в заведенном n_зав = 19,5; в спущенном n_сп = 14; полезных оборотов барабана n_б = 19,5 − 14 = 5,5 | Free 6.5; wound 19.5; let down 14; the barrel's useful turns 5.5 | 6.5 / 19.5 / 14 / 5.5 | 248 |
| Its torque | по формуле (80) … K = 0,95; E = 2,10·10⁵ Н/мм²; b = 14,80 мм; h = 0,42 мм; l_раб = 1300 мм; n_зав − n_св = 13 витков; n_зав − n_св − n_р = 8,13 витка; M_max = 1143,5 Н·мм; M_min = 715 Н·мм | By formula (80), with a working length of 1300 mm: wound and run down | **M_max 1143.5 N·mm, M_min 715 N·mm** | 248 |
| Formula (80) | (not on these pages) | Its figures are K·E·b·h³·2πn/(12 l) with n = 13 and 8.13 turns: 1145 and 716 N·mm, within 0.2 % of the printed. That is the linear spring, counting the turns past the free spring's (inferred). | — | 248 |
| Winding | Полную заводку пружины осуществляют вращением валика улитки против часовой стрелки. … число оборотов барабана составляет 4,87. Предварительно вращением валика барабана на 0,5 оборота создают постоянный натяг пружины. Для снятия натяга пружины в барабане пружину на 0,13 оборота барабана не дозаводят | Wound by the fusee arbor, anticlockwise; the barrel turns 4.87 over the wind; set up 0.5 turn by the barrel arbor; the last 0.13 barrel turn left unwound | **4.87 turns; set-up 0.5; 0.13 short** | 249 |
| Ratchets | Как в узле барабана, так и в узле улитки имеются храповые устройства, предохраняющие пружину от произвольного роспуска и создающие дополнительный резерв хода при заводке пружины | Both the barrel and the fusee have ratchet work: it stops the spring running back, and gives maintaining power while winding | — | 249 |
| Chain (Рис. 141) | Цепь Галля … из 324 наружных (3) и 161 внутренних (2) пластин … штифтов 1. Шаг цепи 2,25 мм; ширина 2 мм, толщина 0,85 мм, длина 728,75 мм; толщина пластин 0,25 мм; крючки 4, 5 … из высокоуглеродистой стали У10А и термически обрабатывают | Gall (fusee) chain of 324 outer and 161 inner plates on pins: pitch, width, thickness, length, plates, two hooks; U10A carbon tool steel, heat treated | **pitch 2.25, 2 × 0.85, 728.75 long, plates 0.25** | 248 |
| Fusee (Рис. 142) | Боковая сторона корпуса 1 улитки имеет криволинейную поверхность со спиральной канавкой прямоугольной формы. … К основанию … храповое колесо 3, к которому крепят зубчатое колесо 2 с z = 90 … с центральным трибом z = 14, m = 0,44 мм | A curved body with a spiral groove of rectangular section; on its base a ratchet wheel carrying the fusee wheel, 90 teeth, meshing with the centre pinion, 14 leaves, module 0.44 | **90/14, m 0.44** | 248 |
| Running time | При числе оборотов улитки n = 8,75 продолжительность действия хронометра от одной заводки равна 8,75·90/14 = 56,2 ч | From 8.75 fusee turns | **56.2 h** | 248 |
| Fusee curve (Рис. 143) | y = (l₀ r₀ e / 4π)(1/x² − 1/r₀²), где l₀ — длина спиральной канавки; e — ширина канавки | The profile AB: the groove's radii vary inversely as the barrel's torque, taking its nonlinearity into account. l₀ is the groove's length, e its width, r₀ the large end's radius, r₁ the small end's. | — | 249 |
| Train (Table 28) | Колесо центральное 90 / Триб промежуточный 12, i₁ = 7,5, m 0,35; Колесо промежуточное 80 / Триб секундный 10, i₂ = 8, m 0,29; Колесо секундное 75 / Триб ходового колеса 10, i₃ = 7,5, m 0,28 | Centre to escape pinion | **90/12 m 0.35; 80/10 m 0.29; 75/10 m 0.28**; i = 450 | 249–250 |
| Escape wheel | Ходовое колесо имеет z = 16. Число колебаний баланса в час n = 450·16 = 7200 и T = 0,5 с | 16 teeth; 7200 an hour | **16 teeth** | 250 |
| Motion work | i = i₄i₅ = 14·18/(56·54) = 1/12 | Two pairs | 14/56, 18/54 | 250 |
| Up-and-down (Рис. 144) | зубчатой пары счетчика часов заводки пружины с z = 12 и z_к = 120; m = 0,28 мм. Триб посажен на ось валика улитки. Полная шкала … разделена на восемь частей … 56,2·120/(8,75·12) = 64 ч | A 12-leaf pinion on the fusee arbor and a 120-tooth wheel, module 0.28; the full scale is eight parts, 64 h a turn | **12/120 m 0.28; 64 h a turn** | 250 |
| Fig. 144's parts | 1 — ось секундной стрелки; 2 — узел триба вексельного колеса; 3 — узел центрального триба; 4 — минутник; 5 — колесо часовое; 6 — узел колеса счетчика завода; 7 — циферблат; 8 — триб счетчика завода; 9 — валик улитки | Seconds arbor; change pinion; centre pinion; cannon pinion; hour wheel; up-and-down wheel; dial; up-and-down pinion; fusee arbor | — | 250 |

### The escape wheel, balance and hairspring (p. 250, Рис. 145 on p. 251)

| Quantity | Russian | English | Value | Page |
|---|---|---|---|---|
| Escape wheel (Рис. 145 а) | имеет зуб фасонной формы, ширина его 1,25 мм при толщине обода, спиц и втулки 0,60 мм, что уменьшает массу колеса | Shaped teeth 1.25 thick across the wheel; the rim, spokes and hub 0.60, to make it lighter | **teeth 1.25 −0.05, web 0.6 −0.03** | 250–251 |
| | z = 16; Ø 13,20 −0,02; Ø 11,30 +0,10; 0,70; 1,97 +0,01 | 16 teeth; the tips; the rim's inside; four spokes 0.70 wide; the hub's bore | **Ø 13.20 −0.02, Ø 11.30 +0.10, 0.70, Ø 1.97 +0.01** | 251 |
| Balance (Рис. 145 б) | Баланс … биметаллический, разрезной | Bimetallic, cut | — | 250 |
| | Ø 32,62 −0,02; 31,19 +0,02; 30,16 +0,02; 0,70; 4,20 −0,03; 0,90 −0,03 | Outside; the metals' joint; inside; the two cuts 0.70 wide, beside the arm's ends; the rim's height; the arm's thickness | **Ø 32.62 / 31.19 / 30.16; 4.20 high; arm 0.90** | 251 |
| Hairspring (Рис. 145 в) | цилиндрическая имеет девять витков и две концевые кривые Филиппса, закрепленные в колодке и колонке. Наружный диаметр 13,20, высота 8,10 мм, шаг 0,80 мм | Helical: nine turns and two Phillips terminal curves, pinned in the collet and the stud; outside diameter, height, pitch | **9 turns, Ø 13.20, 8.10 high, pitch 0.80** | 250–251 |
| Balance's inertia | Момент инерции узла баланса 2744 г·мм² | The balance assembly's | **2744 g·mm²** | 250 |
| Hairspring's moment | момент спирали 0,43289 Н·мм при φ = 1 | The spring's couple at one radian | **0.43289 N·mm a radian** | 250 |
| Masses | масса узла баланса 12,739 г; масса спирали с колодкой и колонкой 1,290 г. Отдельно масса баланса с осью, грузом и роликом составляет 11,449 г, масса спирали 0,522 г | The balance assembly; the spring with its collet and stud; the balance with its staff, weights and roller; the spring alone | **12.739 g = 11.449 + 1.290; spring 0.522 g** | 250 |

Together the two figures give the period: 2π √(2744 g·mm² / 0.43289 N·mm) = **0.5000 s**, the GOST's T (worked here).

### Against the model

| | Tarasov's later 6MX | The model (the drawings; Kirov 247's 6MX) |
|---|---|---|
| Seconds stage, escape wheel | 75/10 m 0.28; 16 teeth, Ø 13.20 | 80/10; 15 teeth, tips Ø 14 |
| Centre and intermediate stages | 90/12 m 0.35, 80/10 m 0.29 | 90/12 m 0.355, 80/10 m 0.281 |
| Fusee wheel | 90/14 m 0.44, 8.75 turns, 56.2 h | 90/14 m 0.436, 8.75 turns |
| Balance | Ø 32.62/31.19/30.16, 4.20 high | Ø 32.32/31.29/30.48, 3.8 high (05 03 01-1) |
| Balance's inertia | 2744 g·mm² (the assembly's; what is counted in it isn't said) | 2526 g·mm² with rollers, collet and a third of the spring, weighed (both versions: `tools/wempe_6mx.json`) |
| Hairspring | 9 turns, Ø 13.20, pitch 0.80; 0.433 N·mm a radian; 0.522 g | 13 turns less 3.5 mm, Ø 12.8, pitch 0.73 (0.52 + 0.21); 0.409 N·mm a radian; 0.59 g |
| Mainspring | 0.42 × 14.8 × 1400; barrel Ø 37.8, arbor Ø 12.6 | 0.37 × 15 × 1240 (length fitted); drum Ø 38.5, core Ø 13.3 |
| Chain | pitch 2.25, 2 × 0.85, plates 0.25 | plates 0.26, three in its 0.82 |

The later design has a heavier balance (8.6 % more inertia; the rim 0.31 mm thicker radially and 0.4 higher) and drives it with a stronger spring (0.42 against 0.37). These are the proportions over which the drawings' 0.37 strip and the 1958 Navy repair book's torques disagree (the Wempe README's note on the 6MX's mainspring: the first-generation MX's 1.01–1.08 N·m fully wound).

### The model's mainspring solver on Tarasov's spring (19 October 2026)

`mainspring.py`, the solver both models' springs come from, was run on Tarasov's strip as a variant: 0.42 × 14.8 × 1400, the barrel's inside r 18.9, the arbor r 6.3, E 210 GPa (Tarasov's 2.10·10⁵ N/mm²), the free curve the solver's usual shape (the Hamilton's measured) with its turns scaled to Tarasov's 6.5 free (`MC_MS_SET` 0.8024), the outer end on a plain wall, frictionless. The table is `tools/mainspring_tarasov1976.js`, made by:

    MC_MS_TAG=tarasov1976 MC_MS_T=0.42 MC_MS_L=1400 MC_MS_RA=6.3 MC_MS_RW=18.9 MC_MS_B=14.8 MC_MS_E=210 MC_MS_GAP=0 MC_MS_SET=0.8024 MC_MS_PASSES=12 MC_MS_PROC=8 MC_MS_TLO=13.5 MC_MS_THI=21.25 python mainspring.py

It took 2½ h on 8 processes, on a machine shared with two other solves.

| | Tarasov | The solver | |
|---|---|---|---|
| Let down (slack) | 14 turns | 14.5 turns | |
| Run down: set up 0.5 turn past the slack | 715 N·mm | **714 N·mm** (at 15.0) | −0.1 % |
| Fully wound: 4.87 barrel turns later | 1143.5 N·mm | 1235 N·mm (at 19.87) | +8.0 % |
| At Tarasov's wound count, 19.5 turns | 1143.5 N·mm | 1185 N·mm | +3.6 % |
| The torque's rise over the wind | 1.60 : 1 | 1.73 : 1 | |
| Coil-bound | (wound 19.5; the last 0.13 barrel turn left unwound) | past 20.75 turns (packed coils' estimate 20.45) | |

Where they part:

- **The formula's K = 0.95.** Formula (80) is the linear spring times K = 0.95, evidently a loss factor. The solver is frictionless. Without K, the formula gives 1206 N·mm at 19.5 turns, within 1.8 % of the solver's 1185. The solver's slope over the working turns is 2–5 % under the formula's.
- **The low end.** The formula puts 715 N·mm at 8.13 turns past the free spring's; the solver has no torque there (14.63 turns is just past its slack). The two meet only through the set-up: the solver's slack plus Tarasov's 0.5 turn gives his 715 almost exactly.
- **The high end.** The solver keeps 0.88 turn of room past full wind; Tarasov's count leaves 0.13 (inferred: his 19.5 is the formula's count, not the solver's coil-bound).

So the solver gives a published 6MX spring's torque to within the loss factor its designer allowed. That supports the solved torques both models run on, the Hamilton's (0.96 N·m) and the Wempe's.
