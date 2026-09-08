#include "./Frame.h"
#include "./Variable.h"
#include "../Core/List.h"

namespace Storage
{
  class Closure
  {
  public:
    Closure(Frame *globals, Core::List<Frame *> frames);

    Variable *search(char *name);
    Closure *with_frame(Frame *frame);
    Closure *add_variable(char *name, Variable *value);
    Variable *search_global(char *name);

  private:
    Frame *globals;
    Core::List<Frame *> frames;
  };
}