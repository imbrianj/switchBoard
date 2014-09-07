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
          LEFT           : "Izquierda",
          MENU           : "Menú",
          MUTE           : "Silenciar",
          OK             : "OK",
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
          DENON        : "Denon",
          BLU_RAY      : "Blu-ray",
          CD           : "CD",
          GAME         : "Juego",
          INPUT        : "Entrada",
          MUSIC_PLAYER : "Equipo de sonido",
          NETWORK      : "Red",
          TV           : "TV",
          VOLUME       : "Volumen",
          ZONE         : "Zona"
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
          BUY     : "El valor de {{LABEL}} esta por debajo de {{PRICE}}. ¿Considere una compra?",
          LOSS    : "Perdida",
          GAIN    : "Ganancia",
          NEUTRAL : "Neutral",
          SELL    : "El valor de {{LABEL}} se ha incrementado mas de {{PRICE}}.  ¿Considere una venta?"
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
        xbmc : {
          XBMC : "XBMC"
        }
      };
    }
  };
}());
