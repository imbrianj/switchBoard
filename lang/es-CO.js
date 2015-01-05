/*jslint white: true */
/*global module, console, require */

/**
 * Copyright (c) 2014 brian@bevey.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/**
 * @author andres.narva@gmail.com
 * @fileoverview Spanish translation file created by an americanized Colombian.
 *               Please feel free to modify this file if you feel you're more
 *               Colombian than I am, or copy over to a new {lang}-{region}.js
 *               file and modify to make terms more familiar to your locale,
 *               then submit as a pull request.
 * @note The en file is used as the default language in the case that a given
 *       string is not available.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140904,

    strings : function () {
      return {
        container : {
          LANGUAGE     : "es-CO",
          APPNAME      : "SwitchBoard",
          CONNECTED    : "Conectado",
          CONNECTING   : "Conectándonos",
          DISCONNECTED : "Desconectado"
        },
        common : {
          ACTIVE         : "Activo",
          BACK           : "De Vuelta",
          BLUE           : "Azul",
          CANCEL         : "Cancelar",
          CHANNEL_DOWN   : "Canal Siguiente",
          CHANNEL_UP     : "Canal Previo",
          DOWN           : "Abajo",
          ENTER          : "Entrar",
          EXIT           : "Salir",
          FAST_FORWARD   : "Adelantar",
          FILE_NOT_FOUND : "Archivo No Encontrado",
          GREEN          : "Verde",
          HDMI           : "HDMI",
          HOME           : "A Casa",
          INACTIVE       : "Inactivo",
          LEFT           : "Izquierda",
          MENU           : "Menú",
          MUTE           : "Silenciar",
          OFF            : "Apagar",
          OK             : "OK",
          ON             : "Prender",
          PAUSE          : "Pausa",
          PLAY           : "Iniciar",
          POWER          : "Poder",
          POWER_OFF      : "Apagar",
          POWER_ON       : "Prender",
          PRESENCE       : "Presencia",
          RECORD         : "Gravar",
          RED            : "Rojo",
          RETURN         : "Regresar",
          REWIND         : "Devolver",
          RIGHT          : "Derecha",
          SELECT         : "Seleccionar",
          SOURCE         : "Origen",
          STOP           : "Parar",
          SUBMIT         : "Someter",
          TEXT_INPUT     : "Text Input",
          UP             : "Up",
          VOLUME_UP      : "Incrementar volumen",
          VOLUME_DOWN    : "Bajar volumen",
          YELLOW         : "Amarillo"
        },
        denon : {
          DENON             : "Denon",
          AAC_DOLBY_EX      : "AAC + Dolby EX",
          AAC_NEO_X_C       : "AAC + Neo:X Cinema",
          AAC_NEO_X_G       : "AAC + Neo:X Juego",
          AAC_NEO_X_M       : "AAC + Neo:X Música",
          AAC_PL2X_C        : "AAC + ProLogic IIx Cinema",
          AAC_PL2X_M        : "AAC + ProLogic IIx Música",
          AAC_PL2Z_H        : "AAC + ProLogic IIz Altura",
          ALL_ZONE_STEREO   : "Toda Zona Stereo",
          AUX1              : "Aux1",
          AUX2              : "Aux2",
          BD                : "Blu-ray",
          CD                : "CD",
          DIRECT            : "Directo",
          DOLBY_D_          : "Dolby Digital Plus",
          DOLBY_DIGITAL     : "Dolby Digital",
          DOLBY_D_EX        : "Dolby Digital EX",
          DOLBY_D_NEO_X_C   : "Dolby Digital + Neo:X Cinema",
          DOLBY_D_NEO_X_G   : "Dolby Digital + Neo:X Juego",
          DOLBY_D_NEO_X_M   : "Dolby Digital + Neo:X Música",
          DOLBY_D_PL2X_C    : "Dolby Digital + ProLogic IIx Cinema",
          DOLBY_D_PL2X_M    : "Dolby Digital + ProLogic IIx Música",
          DOLBY_D_PL2Z_H    : "Dolby Digital + ProLogic IIz Altura",
          DOLBY_D___EX      : "Dolby Digital Plus + EX",
          DOLBY_D___NEO_X_C : "Dolby Digital Plus + Neo:X Cinema",
          DOLBY_D___NEO_X_G : "Dolby Digital Plus + Neo:X Cinema",
          DOLBY_D___NEO_X_M : "Dolby Digital Plus + Neo:X Música",
          DOLBY_D___PL2X_C  : "Dolby Digital Plus + ProLogic IIx Cinema",
          DOLBY_D___PL2X_M  : "Dolby Digital Plus + ProLogic IIx Música",
          DOLBY_D___PL2Z_H  : "Dolby Digital Plus + ProLogic IIz Altura",
          DOLBY_HD          : "Dolby HD",
          DOLBY_HD_EX       : "Dolby HD + EX",
          DOLBY_HD_NEO_X_C  : "Dolby HD + Neo:X Cinema",
          DOLBY_HD_NEO_X_G  : "Dolby HD + Neo:X Juego",
          DOLBY_HD_NEO_X_M  : "Dolby HD + Neo:X Música",
          DOLBY_HD_PL2X_C   : "Dolby HD + ProLogic IIx Cinema",
          DOLBY_HD_PL2X_M   : "Dolby HD + ProLogic IIx Música",
          DOLBY_HD_PL2Z_H   : "Dolby HD + ProLogic IIz Altura",
          DOLBY_PL2X_C      : "Dolby ProLogic IIx Cinema",
          DOLBY_PL2X_G      : "Dolby ProLogic IIx Juego",
          DOLBY_PL2X_M      : "Dolby ProLogic IIx Música",
          DOLBY_PL2Z_H      : "Dolby ProLogic IIz Altura",
          DOLBY_PL2_C       : "Dolby ProLogic II Cinema",
          DOLBY_PL2_G       : "Dolby ProLogic II Juego",
          DOLBY_PL2_M       : "Dolby ProLogic II Música",
          DOLBY_TRUEHD      : "Dolby TrueHD",
          DTS96_24          : "DTS 96/24",
          DTS96_ES_MTRX     : "DTS 96 ES Matrix",
          DTS_ES_8CH_DSCRT  : "DTS ES 8 Canal Discreto",
          DTS_ES_DSCRT6_1   : "DTS ES Discreto 6.1",
          DTS_ES_MTRX6_1    : "DTS ES Matriz 6.1",
          DTS_EXPRESS       : "DTS Express",
          DTS_HD            : "DTS HD",
          DTS_HD_MSTR       : "DTS HD Central",
          DTS_HD_NEO_X_C    : "DTS HD + Neo:X Cinema",
          DTS_HD_NEO_X_G    : "DTS HD + Neo:X Juego",
          DTS_HD_NEO_X_M    : "DTS HD + Neo:X Música",
          DTS_HD_PL2X_C     : "DTS HD + ProLogic IIx Cinema",
          DTS_HD_PL2X_M     : "DTS HD + ProLogic IIx Música",
          DTS_HD_PL2Z_H     : "DTS HD + ProLogic IIz Altura",
          DTS_NEO_X_C       : "DTS + Neo:X Cinema",
          DTS_NEO_X_G       : "DTS + Neo:X Juego",
          DTS_NEO_X_M       : "DTS + Neo:X Música",
          DTS_PL2X_C        : "DTS + ProLogic IIx Cinema",
          DTS_PL2X_M        : "DTS + ProLogic IIx Música",
          DTS_PL2Z_H        : "DTS + ProLogic IIz Altura",
          DTS_SURROUND      : "DTS Surround",
          DVD               : "DVD",
          GAME              : "Juego",
          INPUT             : "Entrada",
          IRADIO            : "Internet Radio",
          JAZZ_CLUB         : "Jazz Club",
          MATRIX            : "Matriz",
          MCH_STEREO        : "Canal Multi Estéreo",
          MONO_MOVIE        : "Mono Película",
          MOVIE             : "Película",
          MPEG2_AAC         : "MPEG2 AAC",
          MPLAY             : "Equipo de Media",
          MULTI_CH_IN       : "Entrada Multicanal",
          MULTI_CH_IN_7_1   : "Entrada Multicanal 7.1",
          MUSIC             : "Música",
          M_CH_IN_DOLBY_EX  : "Entrada Multicanal + Dolby Digital EX",
          M_CH_IN_NEO_X_C   : "Entrada Multicanal + Neo:X Cinema",
          M_CH_IN_NEO_X_G   : "Entrada Multicanal + Neo:X Juego",
          M_CH_IN_NEO_X_M   : "Entrada Multicanal + Neo:X Música",
          M_CH_IN_PL2X_C    : "Entrada Multicanal + ProLogic II",
          M_CH_IN_PL2X_M    : "Entrada Multicanal + ProLogic IIx Música",
          M_CH_IN_PL2Z_H    : "Entrada Multicanal + ProLogic IIz Altura",
          NET               : "Red",
          PHONO             : "Fono",
          PURE_DIRECT       : "Directo Puro",
          ROCK_ARENA        : "Estadio de Rock",
          SAT_CBL           : "CBL/SAT",
          SOUNDMODE         : "Modo de Sonido",
          STANDARD          : "Standard",
          STANDBY           : "Espera",
          STEREO            : "Estéreo",
          TUNER             : "Sintonizador",
          TV                : "TV Audio",
          USB_IPOD          : "iPod/USB",
          VIDEO_GAME        : "Video Juego",
          VIRTUAL           : "Virtual",
          VOLUME            : "Volumen",
          Z1                : "Zona 1",
          Z2                : "Zona 2",
          Z3                : "Zona 3"
        },
        foscam : {
          FOSCAM          : "Foscam",
          ARM             : "Armar",
          BURST           : "Tomar fotos consecutivas",
          CAMERA_ARMED    : "Cámara armada",
          CAMERA_DISARMED : "Cámara desarmada",
          DISARM          : "Desarmar",
          PRESET          : "Configurar",
          TAKE            : "Tomar"
        },
        gerty : {
          GERTY        : "Gerty",
          AND          : "Y",
          ARM          : "Armar",
          CAMERA       : "Cámara",
          CHANNEL_DOWN : "Canal Previo",
          CHANNEL_UP   : "Siguiente Canal",
          COOL         : "Enfriar",
          DISARM       : "Desarmar",
          DOWN         : "Bajar",
          ENTER        : "Entrar",
          HEAT         : "Calentar",
          LEFT         : "Izquierda",
          OFF          : "Apagar",
          ON           : "Prender",
          PLAYSTATION  : "Playstation",
          RIGHT        : "Derecha",
          STEREO       : "Estéreo",
          STOCKS       : "Mercado de valores",
          TOGGLE       : "Cambiar",
          TV           : "TV",
          UP           : "Arriba",
          WEATHER      : "Tiempo",
          SYNONYMS : {
            AFFIRMATIVE : ["Si",
                           "Bueno",
                           "Bueno, ya lo hago",
                           "No puedo hacer eso",
                           "Por supuesto",
                           "Claro que si",
                           "De una",
                           "Dale"
                          ],
            NEGATIVE    : ["Perdón, no entendí",
                           "Perdón?",
                           "Que?",
                           "Háblame mas duro!",
                           "Perdón, Dave.  No voy a poder hacer eso",
                           "No me dan ganas de hacerlo",
                           "No tengo ni idea de lo que dices",
                           "No oigo",
                           "Hágalo usted",
                           "No",
                           "Lo siento"],
            ANGRY       : ["Enojado",
                           "Furioso",
                           "Enfadado",
                           "Muerto de la piedra"],
            EXCITED     : ["Emocionado"],
            HAPPY       : ["Feliz",
                           "Contento"],
            INDIFFERENT : ["Indiferente",
                           "Antipático"],
            LOVE        : ["Amor",
                           "Corazones"],
            PLAYFUL     : ["Juguetón",
                           "Travieso",
                           "Malo",
                           "Vivo"],
            SAD         : ["Triste",
                           "Decepcionado",
                           "Deprimido"],
            SCARED      : ["Asustado",
                           "Triste",
                           "Miedoso"],
            SLEEP       : ["Acostado",
                           "Cansado"],
            STRESSED    : ["Estresado"]
          }
        },
        lg : {
          LG       : "LG",
          EXTERNAL : "Externo",
          INFO     : "información",
        },
        mp3 : {
          MP3 : "MP3"
        },
        nest : {
          NEST               : "Nest",
          AWAY               : "Afuera de Casa",
          BASEMENT           : "Sótano",
          BATT               : "Batería",
          BEDROOM            : "Cuarto",
          CO                 : "CO",
          CO_DETECTED        : "¡{{LABEL}} detección de CO!",
          COOL               : "Fresco",
          DEN                : "Sala de estudio",
          DINING_ROOM        : "Sala de Comedor",
          DOWNSTAIRS         : "Piso de Abajo",
          ENTRYWAY           : "Entrada",
          FAMILY_ROOM        : "Sala de entretenimiento",
          HALLWAY            : "Pasillo",
          HEAT               : "Prender calentador",
          HOME               : "Casa",
          HUMIDITY           : "Humedad",
          KIDS_ROOM          : "Cuarto de Niños",
          KITCHEN            : "Cocina",
          LEAF               : "Se esta ahorrando energía",
          LIVING_ROOM        : "Sala de Estar",
          MASTER_BEDROOM     : "Cuarto principal",
          OFFICE             : "Oficina",
          PROTECT            : "Proteger",
          SET_TEMPERATURE    : "Guardar temperatura",
          SMOKE              : "Humo",
          SMOKE_DETECTED     : "{{LABEL}} se detecto humo!",
          TARGET             : "Objetivo",
          TARGET_TEMPERATURE : "Objetivo de temperatura",
          TEMP               : "Temp",
          THERMOSTAT         : "Termostato",
          UPSTAIRS           : "Piso de arriba"
        },
        panasonic : {
          PANASONIC    : "Panasonic",
          CHANGE_INPUT : "Cambiar entrada",
          INFO         : "Info",
          INTERNET     : "Internet",
          SUBMENU      : "Submenú",
          VIERA_LINK   : "Viera Link"
        },
        pioneer : {
          PIONEER        : "Pioneer",
          BD             : "BD",
          CD             : "CD",
          CDR_TAPE       : "CD-R/Tape",
          DVD            : "DVD",
          DVR_BDR        : "DVR/BDR",
          INTERNET_RADIO : "Radio Internet",
          IPOD_USB       : "iPod/USB",
          PANDORA        : "Pandora",
          ROKU           : "Roku",
          SIRIUS_XM      : "Sirius XM",
          TUNER          : "Tuner",
          TV_SAT         : "TV/Sat",
          VIDEO          : "Video"
        },
        ps3 : {
          PS3      : "PS3",
          CIRCLE   : "Circulo",
          CROSS    : "Cruz",
          L1       : "L1",
          L2       : "L2",
          PS       : "PS",
          R1       : "R1",
          R2       : "R2",
          SELECT   : "Seleccionar",
          START    : "Empezar",
          TRIANGLE : "Triángulo"
        },
        pushover : {
          PUSHOVER : "Notificaciones en vivo"
        },
        raspberryRemote : {
          RASPBERRY_REMOTE : 'Raspberry Remote'
        },
        roku : {
          ROKU           : "Roku",
          BACKSPACE      : "Borrar",
          FORWARD        : "Adelantar",
          INSTANT_REPLAY : "Repetición instantánea"
        },
        samsung : {
          SAMSUNG          : "Samsung",
          CEC_SPEAKERS     : "CEC Altavoces",
          CHANNEL_LISTING  : "Canales",
          MORE             : "Mas",
          PREVIOUS_CHANNEL : "Canal previo",
          SMART_HUB        : "Cubo inteligente",
          TOOLS            : "Herramientas",
          WEB_BROWSER      : "Navegador"
        },
        smartthings : {
          SMARTTHINGS    : "SmartThings",
          ARRIVED        : "{{LABEL}} acabo de llegar",
          AWAY           : "Por fuera",
          HOME           : "En Casa",
          LEFT           : "{{LABEL}} acabo de salir",
          NIGHT          : "Night",
          WATER_DETECTED : "¡{{LABEL}} detecto agua!"
        },
        sms : {
          SMS : "SMS"
        },
        speech : {
          SPEECH : "Voz"
        },
        stocks : {
          STOCKS  : "Mercado de valores",
          BUY     : "El valor de {{LABEL}} esta por debajo de ${{PRICE}}. ¿Considere una compra?",
          LOSS    : "Perdida",
          GAIN    : "Ganancia",
          NEUTRAL : "Neutral",
          SELL    : "El valor de {{LABEL}} se ha incrementado mas de ${{PRICE}}.  ¿Considere una venta?"
        },
        traffic : {
          TRAFFIC : "Tráfico"
        },
        travis : {
          TRAVIS        : "Travis",
          BUILD_FAILURE : "¡La construcción por medio de Travis no se completo!",
          BUILD_STATUS  : "Estado de construcción"
        },
        weather : {
          WEATHER     : "Tiempo",
          CURRENT     : "Tiempo actual",
          UNAVAILABLE : "No se encontró el tiempo actual"
        },
        welcome : {
          WELCOME   : "Bienvenido",
          HEADER    : "¡Bienvenido!",
          SUCCESS   : "Bienvenido a SwitchBoard.  Si estas viendo este mensaje, quiere decir que todo esta funcionando y solamente tienes que configurar su control remoto.",
          CONFIGURE : "Por favor abra el documento config/config.js que contiene la configuración initial de aparatos electrónicos comunes.  Si encuentras un aparato parecido al suyo, por favor configúrelo con la información especifica que le pertenece al suyo.  Si hay algo que no le funciona, por favor estudiar los muchos comentarios atra vez de config.js y los muchos otros archivos.  Y ya que estas en el archivo config.js, puedes configurar el aparato \"welcome\", modificándolo a disabled: true para no ver este mensaje otra vez.",
          SUPPORT   : "Atascado? Preguntas?  Algo no le funciono o tiene una sugerencia? Por favor tómese la libertad de documentar su situación <a href=\"https://github.com/imbrianj/switchBoard/issues/new\" rel=\"external\">aqui</a> o mandarme un email a <a href=\"mailto:brian@bevey.org\" rel=\"external\">brian@bevey.org</a>."
        },
        wemo : {
          WEMO : "Wemo"
        },
        xbmc : {
          XBMC : "XBMC",
          MOVIE       : "Película",
          SCREENSAVER : "Protector de pantalla"
        }
      };
    }
  };
}());
