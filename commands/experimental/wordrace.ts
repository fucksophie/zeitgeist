import { Client, Player } from "../../classes/Client.ts";
import { getDPlayer, setDPlayer } from "../../classes/Database.ts";

interface WordraceTimeout {
    answer: string;
    wrong: number;
    time: number;
    server: string;
}

const timeouts: Map<string, WordraceTimeout> = new Map<string, WordraceTimeout>();

const Words = ["notice","vacation","symptomatic","maddening","ugliest","observation","defective","cycle","arrest","kittens","soup","condemned","robust","tent","mysterious","balance","previous","elated","scene","grass","condition","stupid","kitty","approval","alluring","weigh","haunt","humorous","motionless","children","zesty","treatment","imminent","fabulous","ill-informed","admit","strap","protective","blink","peel","shiny","furry","mix","tongue","jittery","idiotic","ritzy","tart","boast","minute","cumbersome","sticky","end","nimble","inject","wistful","shop","cellar","useful","can","amazing","disarm","neat","stream","shelter","snobbish","angry","radiate","homeless","scrub","offend","thrill","hair","piquant","accessible","assorted","selfish","yielding","place","believe","soggy","airplane","abaft","oval","poison","trucks","stone","visitor","jumpy","hang","bless","cheat","bone","nerve","minister","hate","dizzy","songs","nutritious","elite","fluffy","grandiose","fine","complex","addition","worthless","roasted","ill-fated","halting","arrogant","literate","snake","crash","person","yarn","dinosaurs","crowd","tooth","imaginary","love","satisfy","voiceless","provide","arrange","hydrant","supreme","tasty","terrify","gabby","distance","sip","bee","air","deadpan","silent","tiger","superb","toothbrush","mourn","mitten","overjoyed","faded","discreet","nappy","cow","placid","meat","authority","deliver","impartial","historical","remove","proud","mint","march","married","burly","sulky","poor","erect","fear","obsolete","gold","volatile","enormous","five","grandfather","lumber","acoustics","uninterested","able","deserted","boot","extra-large","roof","examine","naughty","stereotyped","transport","husky","utopian","weak","smash","pop","drain","fry","full","curve","engine","marvelous","marry","quickest","time","needless","thank","succeed","gullible","insect","faint","rainy","reaction","likeable","reward","little","curl","gaping","damaged","servant","bath","acid","excite","pass","internal","measly","territory","languid","example","enjoy","handsome","guiltless","sniff","invite","chivalrous","loutish","scarce","disgusting","festive","succinct","madly","bite","reply","connection","crawl","honorable","makeshift","share","unfasten","cave","habitual","swift","wood","lame","toy","trees","tow","shiver","endurable","annoying","earthquake","quack","vivacious","baseball","fork","unique","cart","ruin","cover","lunch","lavish","healthy","upset","enchanting","report","stale","coach","wide-eyed","income","wait","oil","deranged","loud","tasteless","rush","charge","reason","heady","pies","cup","smooth","afford","pushy","knowledgeable","nebulous","crush","moan","envious","abusive","bolt","longing","pet","befitting","books","throne","camera","therapeutic","aboard","morning","bump","card","debonair","chief","depressed","prefer","boundless","art","amuse","tire","prevent","harm","space","parcel","spiky","enthusiastic","familiar","military","carve","decisive","steel","faithful","smoke","train","defeated","coordinated","close","appliance","jam","classy","afterthought","painful","event","common","protect","ceaseless","tender","trite","zipper","whole","thaw","file","guess","shallow","domineering","mist","hand","decide","nonchalant","butter","passenger","pretend","nauseating","scream","force","limit","skip","try","behave","drawer","hop","trousers","harmony","steer","selection","release","tense","wealth","busy","rich","driving","actor","jagged","advice","club","rings","texture","friend","continue","sedate","chance","achiever","incompetent","earthy","grade","trick","wrist","alcoholic","limping","unsightly","blushing","dog","raspy","monkey","agreement","rough","north","helpful","press","increase","astonishing","harsh","shirt","right","behavior","riddle","homely","upbeat","rifle","flimsy","tough","grain","test","rescue","spell","mundane","extra-small","spurious","action","fasten","irritating","slip","moldy","reach","distinct","cabbage","experience","lock","quill","alive","frantic","tidy","playground","support","current","degree","encouraging","country","chop","subsequent","rejoice","stir","sin","switch","squealing","jeans","glass","prose","quiver","gentle","suspect","middle","leg","dust","cynical","false","medical","rhetorical","whine","sable","fierce","wiry","sparkle","trouble","periodic","clap","price","launch","steam","expensive","damage","delightful","rely","quilt","deep","sisters","burst","theory","hushed","paint","purring","mice","tiny","bang","recognise","unkempt","glistening","tank","stew","adjustment","modern","creepy","noiseless","terrible","clover","chubby","collar","lip","strong","face","stiff","dangerous","expand"];

function listener(player: Player, message: string, client: Client) {    
    const wordrace = timeouts.get(client.wsUrl);
    if(!wordrace) return;

    if(wordrace.answer !== message) {        
        wordrace.wrong ++;

        if(wordrace.wrong == 10) {
            wordrace.wrong = 0;
            wordrace.answer = "";
            client.message("Timed out.");
            client.off("message", listener)
            timeouts.delete(client.wsUrl);
            return;
        }
    } else {
        const dPlayer = getDPlayer(client, player)

        const money = Math.floor(1/(Date.now() - wordrace.time)*200000);
        dPlayer.money += money;
        
        setDPlayer(dPlayer)

        wordrace.wrong = 0;
        wordrace.answer = ""
        client.message(player.name + " got it right! Took you: " + (Date.now() - wordrace.time) + "ms. You got " + money + "#$.")

        client.off("message", listener)
        timeouts.delete(client.wsUrl);

    }
}

export default function (_: Player, client: Client) {
    if(timeouts.get(client.wsUrl)) {
        client.message("Wordrace already running!");
        return;
    }

    timeouts.set(client.wsUrl, "lmfao" as unknown as WordraceTimeout);

    client.message("Please wait..");            

    setTimeout(() => {
        timeouts.set(client.wsUrl, {
            answer: Words[Math.floor(Math.random() * Words.length)],
            wrong: 0,
            time: Date.now(),
            server: client.wsUrl
        })

        client.message("NOW WRITE: [" + timeouts.get(client.wsUrl)!.answer + "]!")            

        client.on("message", listener)
    }, 1000+(Math.random()*10000));
}
