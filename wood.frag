
/* *******************************************************
 * Created By Ethan Kreloff April 8th, 2014.
 *********************************************************
 * Based off of code from the Orange Book Chapter 8 by 
 * Charles Gruenwald and sample code from CSCI 4239/5239
 * at University of Colorado at Boulder.
 * *******************************************************
 * Shader that adds a woody moxture of colors to an object
 * *******************************************************
 * wood.frag
 * ******************************************************/



varying float LightIntensity;

uniform sampler3D Noise3D;
uniform sampler2D CourtTex0;

const float RingFreq         = 0.0;
const float LightGrains      = 0.8;
const float DarkGrains       = -1.2;
const float GrainThreshold   = 0.4;
const float Noisiness        = 1.0;
const float GrainScale       = -34.01;
const float Scale            = 1.2;

const vec3 LightWood  = vec3(1.0,0.894,0.628);
const vec3 DarkWood   = vec3(0.561,0.366,0.15);
const vec3 NoiseScale = vec3(0.2,1.55,1.8);




void main(void)
{
    vec3 MCposition = Scale*gl_TexCoord[0].xyz;
    vec2 texPosition = (gl_TexCoord[0].zx + vec2(13.0, 29.6)) * vec2(0.033, 0.0165);
    vec4 logo = texture2D(CourtTex0,texPosition);
    vec3 noisev = vec3(texture3D(Noise3D,MCposition * NoiseScale) * Noisiness);
    vec3 location = MCposition + noisev;
    float dist = sqrt(location.z*location.z);
    dist *= RingFreq;
    float r = fract(dist + noisev[0] + noisev[1] + noisev[2])*2.0;
    if(r > 1.0){
        r = 2.0 - r;
    }
    vec3 color =  mix(LightWood, DarkWood, r);
    r = fract((MCposition.z)*GrainScale + 0.5);
    noisev[2] *= r;
    if (r < GrainThreshold) {
        color += LightWood * LightGrains * noisev[2];
    }else{
        color -= LightWood * LightGrains * noisev[2];
    }
    
    //  Apply final color
    if((logo.r + logo.g +logo.b)/3.0 == 1.0){
        gl_FragColor = vec4(color, 1.0) * LightIntensity*1.1;
    }else{
        gl_FragColor = logo * vec4(color, 1.0) * LightIntensity;
    }

}

