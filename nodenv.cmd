@echo off
rem Shim so Plesk's "nodenv exec <cmd>" works on Windows hosts without nodenv installed.
rem Plesk calls: nodenv exec npm run deploy
rem This runs:   npm run deploy
%2 %3 %4 %5 %6 %7 %8 %9
